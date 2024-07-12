/**
 * @function openTab
 * @description Permet de choisir l'affichage en cours en mode Live
 * @returns {void}
 */
function openTab(tabName) {
    if (tabName === 'Classement') {
        document.getElementById('Classement').classList.remove('hidden');
        document.getElementById('RaceControl').classList.add('hidden');
        document.getElementById('Radio').classList.add('hidden');
        document.getElementById('btnClassement').classList.add('active');
        document.getElementById('btnClassement').classList.add('underline');
        document.getElementById('btnRaceControl').classList.remove('active');
        document.getElementById('btnRaceControl').classList.remove('underline');
        document.getElementById('btnRadio').classList.remove('active');
        document.getElementById('btnRadio').classList.remove('underline');
    } else if (tabName === 'RaceControl') {
        document.getElementById('RaceControl').classList.remove('hidden');
        document.getElementById('Classement').classList.add('hidden');
        document.getElementById('Radio').classList.add('hidden');
        document.getElementById('btnRaceControl').classList.add('active');
        document.getElementById('btnRaceControl').classList.add('underline');
        document.getElementById('btnClassement').classList.remove('active');
        document.getElementById('btnClassement').classList.remove('underline');
        document.getElementById('btnRadio').classList.remove('active');
        document.getElementById('btnRadio').classList.remove('underline');
    } else if (tabName === 'Radio') {
        document.getElementById('Radio').classList.remove('hidden');
        document.getElementById('Classement').classList.add('hidden');
        document.getElementById('RaceControl').classList.add('hidden');
        document.getElementById('btnRadio').classList.add('active');
        document.getElementById('btnRadio').classList.add('underline');
        document.getElementById('btnClassement').classList.remove('active');
        document.getElementById('btnClassement').classList.remove('underline');
        document.getElementById('btnRaceControl').classList.remove('active');
        document.getElementById('btnRaceControl').classList.remove('underline');
    }
}