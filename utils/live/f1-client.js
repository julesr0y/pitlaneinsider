const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const F1_ORIGIN_URL = 'https://www.formula1.com';
const F1_HTTP_URL = 'https://livetiming.formula1.com/signalrcore';
const F1_WS_URL = 'wss://livetiming.formula1.com/signalrcore';

const NEGOTIATE_VERSION = '1';
const RECORD_SEP = '\x1e';
const SUBSCRIBE_INVOCATION_ID = '0';

const MSG_INVOCATION = 1;
const MSG_COMPLETION = 3;

const HANDSHAKE_MESSAGE = `{"protocol":"json","version":1}${RECORD_SEP}`;

const driverMapping = {
    3: "VER", 10: "GAS", 30: "LAW", 43: "COL", 44: "HAM",
    55: "SAI", 16: "LEC", 63: "RUS", 1: "NOR", 18: "STR",
    14: "ALO", 31: "OCO", 23: "ALB", 41: "LIN", 81: "PIA",
    27: "HUL", 5: "BOR", 6: "HAD", 12: "ANT", 87: "BEA",
    77: "BOT", 11: "PER"
};

const SUBSCRIBE_CHANNELS = [
    'TimingData',
    'TimingAppData',
    'DriverList',
    'SessionInfo',
    'WeatherData',
    'RaceControlMessages',
    'LapCount',
    'TeamRadio'
];

class F1LiveClient {
    constructor(broadcastCallback) {
        this.broadcast = broadcastCallback;
        this.ws = null;
        this.isConnected = false;
        
        // Global State Cache
        this.standings = {}; 
        this.timingAppData = {}; // Tires
        this.driverList = {}; // Driver data including team colors
        this.weather = {};
        this.session = {};
        this.raceControl = [];
        this.lapCount = {};
        this.teamRadio = [];
    }

    async connect() {
        try {
            console.log("[F1Client] Pre-negotiating with F1 SignalR...");
            const preNegResp = await fetch(`${F1_HTTP_URL}/negotiate`, {
                method: 'OPTIONS',
                headers: { 'User-Agent': 'BestHTTP', Origin: F1_ORIGIN_URL },
            });
            const rawCookie = preNegResp.headers.get('set-cookie') || '';
            const awsMatch = rawCookie.match(/AWSALBCORS=([^;]+)/);
            const awsAlbCors = awsMatch ? awsMatch[1] : '';

            const negotiateHeaders = {
                'User-Agent': 'BestHTTP',
                Origin: F1_ORIGIN_URL,
                'Content-Type': 'text/plain',
            };
            if (awsAlbCors) negotiateHeaders['Cookie'] = `AWSALBCORS=${awsAlbCors}`;

            const negotiateResp = await fetch(`${F1_HTTP_URL}/negotiate?negotiateVersion=${NEGOTIATE_VERSION}`, {
                method: 'POST',
                headers: negotiateHeaders
            });

            if (!negotiateResp.ok) throw new Error(`Negotiate failed — HTTP ${negotiateResp.status}`);

            const negotiateData = await negotiateResp.json();
            const connectionToken = encodeURIComponent(negotiateData.connectionToken);

            let wsUrl = `${F1_WS_URL}?id=${connectionToken}`;
            const wsHeaders = {
                'User-Agent': 'BestHTTP',
                Origin: F1_ORIGIN_URL,
            };
            if (awsAlbCors) wsHeaders['Cookie'] = `AWSALBCORS=${awsAlbCors}`;

            console.log("[F1Client] Connecting to F1 SignalR Core WebSocket...");
            this.ws = new WebSocket(wsUrl, { headers: wsHeaders });
            this.setupListeners();
        } catch (error) {
            console.error("[F1Client] Connection error:", error);
            setTimeout(() => this.connect(), 5000);
        }
    }

    setupListeners() {
        let isHandshakeComplete = false;

        this.ws.on('open', () => {
            console.log("[F1Client] WebSocket open — sending handshake...");
            this.ws.send(HANDSHAKE_MESSAGE);
        });

        this.ws.on('message', (data) => {
            try {
                const raw = data.toString('utf-8');
                for (const segment of raw.split(RECORD_SEP)) {
                    if (segment.length === 0) continue;
                    const frame = JSON.parse(segment);

                    if (!isHandshakeComplete) {
                        if (frame.error) {
                            console.error("[F1Client] Handshake rejected:", frame.error);
                            this.ws.close();
                            return;
                        }
                        isHandshakeComplete = true;
                        this.isConnected = true;
                        console.log("[F1Client] Handshake complete. Subscribing to channels...");
                        
                        try {
                            const logPath = path.join(__dirname, '../../signalr_connections.log');
                            const timestamp = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
                            fs.appendFileSync(logPath, `[${timestamp}] F1 SignalR connection successfully established.\n`);
                        } catch (err) {
                            console.error('[F1Client] Failed to write to connection log:', err.message);
                        }

                        this.sendSubscribe();
                        return;
                    }

                    if (frame.type === MSG_COMPLETION && frame.invocationId === SUBSCRIBE_INVOCATION_ID) {
                        if (frame.result) {
                            this.handleSnapshot(frame.result);
                        }
                    }

                    if (frame.type === MSG_INVOCATION && frame.target === 'feed') {
                        const args = frame.arguments;
                        if (args && args.length >= 2) {
                            const channel = args[0];
                            const payload = args[1];
                            this.routeData(channel, payload);
                        }
                    }
                }
            } catch (err) {
                // Silent catch for partial frames
            }
        });

        this.ws.on('close', () => {
            this.isConnected = false;
            console.log("[F1Client] Disconnected. Reconnecting in 5s...");
            setTimeout(() => this.connect(), 5000);
        });

        this.ws.on('error', (err) => {
            console.error("[F1Client] Error:", err);
        });
    }

    sendSubscribe() {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
        const msg = JSON.stringify({
            type: MSG_INVOCATION,
            invocationId: SUBSCRIBE_INVOCATION_ID,
            target: 'Subscribe',
            arguments: [SUBSCRIBE_CHANNELS],
        });
        this.ws.send(`${msg}${RECORD_SEP}`);
    }

    handleSnapshot(result) {
        if (result.DriverList) this.routeData('DriverList', result.DriverList);
        if (result.TimingAppData) this.routeData('TimingAppData', result.TimingAppData);
        if (result.TimingData) this.routeData('TimingData', result.TimingData);
        if (result.SessionInfo) this.routeData('SessionInfo', result.SessionInfo);
        if (result.WeatherData) this.routeData('WeatherData', result.WeatherData);
        if (result.RaceControlMessages) this.routeData('RaceControlMessages', result.RaceControlMessages);
        if (result.LapCount) this.routeData('LapCount', result.LapCount);
        if (result.TeamRadio) this.routeData('TeamRadio', result.TeamRadio);
    }

    routeData(channel, dataStr) {
        if (!dataStr) return;
        const data = typeof dataStr === 'string' ? JSON.parse(dataStr) : dataStr;

        switch (channel) {
            case 'DriverList':
                this.processDriverList(data);
                break;
            case 'TimingAppData':
                this.processTimingAppData(data);
                break;
            case 'TimingData':
                this.processTimingData(data);
                break;
            case 'SessionInfo':
                this.session = data;
                if (this.broadcast) this.broadcast({ type: 'session', data: this.session });
                break;
            case 'WeatherData':
                this.weather = { ...this.weather, ...data };
                if (this.broadcast) this.broadcast({ type: 'weather', data: this.weather });
                break;
            case 'RaceControlMessages':
                if (data.Messages && Array.isArray(data.Messages)) {
                    this.raceControl = [...this.raceControl, ...data.Messages].slice(-50); // Keep last 50
                    if (this.broadcast) this.broadcast({ type: 'race_control', data: this.raceControl });
                }
                break;
            case 'LapCount':
                this.lapCount = data;
                if (this.broadcast) this.broadcast({ type: 'lap_count', data: this.lapCount });
                break;
            case 'TeamRadio':
                if (data.Captures && Array.isArray(data.Captures)) {
                    this.teamRadio = [...data.Captures, ...this.teamRadio].slice(0, 30);
                    if (this.broadcast) this.broadcast({ type: 'team_radio', data: this.teamRadio });
                }
                break;
        }
    }

    processDriverList(data) {
        if (!data) return;
        
        let hasChanges = false;
        for (const [racingNumber, driverData] of Object.entries(data)) {
            if (!this.driverList[racingNumber]) this.driverList[racingNumber] = {};
            if (driverData.TeamColour) {
                this.driverList[racingNumber].TeamColour = driverData.TeamColour;
                hasChanges = true;
            }
        }
        
        if (hasChanges) {
            this.broadcastStandings();
        }
    }

    processTimingAppData(data) {
        if (!data || !data.Lines) return;
        
        let hasChanges = false;
        for (const [racingNumber, driverData] of Object.entries(data.Lines)) {
            if (!this.timingAppData[racingNumber]) this.timingAppData[racingNumber] = { Stints: [] };
            
            if (driverData.Stints) {
                const stintsObj = Array.isArray(driverData.Stints) ? Object.assign({}, driverData.Stints) : driverData.Stints;
                for (const [idx, stint] of Object.entries(stintsObj)) {
                    if (stint && stint.Compound) {
                        this.timingAppData[racingNumber].Stints[idx] = stint.Compound.toLowerCase();
                        hasChanges = true;
                    }
                }
            }
        }
        
        if (hasChanges) {
            this.broadcastStandings();
        }
    }

    processTimingData(data) {
        if (!data || !data.Lines) return;

        let hasChanges = false;
        for (const [racingNumber, driverData] of Object.entries(data.Lines)) {
            if (!this.standings[racingNumber]) {
                this.standings[racingNumber] = {
                    racingNumber,
                    driverCode: driverMapping[racingNumber] || racingNumber,
                    position: 99,
                    trend: 'none',
                    gapToLeader: "",
                    interval: "",
                    inPit: false,
                    stopped: false,
                    retired: false,
                    lastLap: "",
                    bestLap: "",
                    pits: 0
                };
            }

            const st = this.standings[racingNumber];
            if (driverData.Position) { 
                const newPos = parseInt(driverData.Position, 10);
                if (st.position !== 99 && newPos !== st.position) {
                    st.trend = newPos < st.position ? 'up' : 'down';
                    if (st.trendTimer) clearTimeout(st.trendTimer);
                    st.trendTimer = setTimeout(() => {
                        st.trend = 'none';
                        this.broadcastStandings();
                    }, 5000);
                }
                st.position = newPos;
                hasChanges = true; 
            }
            if (driverData.GapToLeader && driverData.GapToLeader.Value) { st.gapToLeader = driverData.GapToLeader.Value; hasChanges = true; }
            if (driverData.IntervalToPositionAhead && driverData.IntervalToPositionAhead.Value) { st.interval = driverData.IntervalToPositionAhead.Value; hasChanges = true; }
            if (driverData.InPit !== undefined) { st.inPit = driverData.InPit; hasChanges = true; }
            if (driverData.Stopped !== undefined) { st.stopped = driverData.Stopped; hasChanges = true; }
            if (driverData.Retired !== undefined) { st.retired = driverData.Retired; hasChanges = true; }
            if (driverData.LastLapTime && driverData.LastLapTime.Value) { st.lastLap = driverData.LastLapTime.Value; hasChanges = true; }
            if (driverData.BestLapTime && driverData.BestLapTime.Value) { st.bestLap = driverData.BestLapTime.Value; hasChanges = true; }
            if (driverData.NumberOfPitStops !== undefined) { st.pits = driverData.NumberOfPitStops; hasChanges = true; }
        }

        if (hasChanges) {
            this.broadcastStandings();
        }
    }

    broadcastStandings() {
        if (!this.broadcast) return;
        
        const standingsArray = Object.values(this.standings)
            .filter(d => d.position !== 99)
            .sort((a, b) => a.position - b.position)
            .map(d => {
                // Attach tire data dynamically
                let currentTire = 'unknown';
                if (this.timingAppData[d.racingNumber] && this.timingAppData[d.racingNumber].Stints.length > 0) {
                    const stints = this.timingAppData[d.racingNumber].Stints;
                    // Get the last valid element
                    for (let i = stints.length - 1; i >= 0; i--) {
                        if (stints[i]) {
                            currentTire = stints[i];
                            break;
                        }
                    }
                }
                const teamColor = this.driverList[d.racingNumber]?.TeamColour || "808080";
                return { ...d, currentTire, teamColor };
            });

        this.broadcast({ type: 'standings', data: standingsArray });
    }

    getFullState() {
        const standingsArray = Object.values(this.standings)
            .filter(d => d.position !== 99)
            .sort((a, b) => a.position - b.position)
            .map(d => {
                let currentTire = 'unknown';
                if (this.timingAppData[d.racingNumber] && this.timingAppData[d.racingNumber].Stints.length > 0) {
                    const stints = this.timingAppData[d.racingNumber].Stints;
                    for (let i = stints.length - 1; i >= 0; i--) {
                        if (stints[i]) {
                            currentTire = stints[i];
                            break;
                        }
                    }
                }
                const teamColor = this.driverList[d.racingNumber]?.TeamColour || "808080";
                return { ...d, currentTire, teamColor };
            });

        return {
            type: 'full_state',
            standings: standingsArray,
            weather: this.weather,
            session: this.session,
            raceControl: this.raceControl,
            lapCount: this.lapCount,
            teamRadio: this.teamRadio
        };
    }
}

module.exports = F1LiveClient;
