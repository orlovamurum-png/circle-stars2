import * as THREE from 'three';

console.log('🔄 Загрузка игры...');

// ============================================================
//  ⭐ СОХРАНЕНИЕ ПРОГРЕССА
// ============================================================
const SAVE_KEY = 'brawlStarsSave';

let playerData = {
    coins: 0,
    powerPoints: 0,
    chests: 0,
    ownedBrawlers: ['shelly'],
    selectedBrawler: 'shelly',
    brawlerStats: {},
    brawlerLevels: {},
    brawlerStarPowers: {},
    brawlerHypercharge: {}
};

// ============================================================
//  ⭐ СИСТЕМА ПРОКАЧКИ
// ============================================================
const LEVELS = 11;
const HP_PER_LEVEL = 0.05;
const SPEED_PER_LEVEL = 0.005;
const UPGRADE_COST = [0, 20, 35, 50, 70, 100, 140, 190, 250, 330, 420];

const STAR_POWERS = [
    { id: 'sp_1', name: 'Быстрый заряд', desc: 'Скорость перезарядки +15%', icon: '⚡' },
    { id: 'sp_2', name: 'Щит', desc: 'Получает щит при уроне', icon: '🛡️' },
    { id: 'sp_3', name: 'Дополнительный урон', desc: 'Урон +10%', icon: '💥' },
    { id: 'sp_4', name: 'Регенерация', desc: 'Восстанавливает HP каждые 3с', icon: '❤️' },
    { id: 'sp_5', name: 'Ускорение', desc: 'Скорость +8%', icon: '💨' },
    { id: 'sp_6', name: 'Вампиризм', desc: 'Восстанавливает 10% от урона', icon: '🩸' },
    { id: 'sp_7', name: 'Снайпер', desc: 'Дальность атаки +20%', icon: '🎯' },
    { id: 'sp_8', name: 'Танк', desc: 'Максимальное HP +15%', icon: '💪' },
];

const HYPERCHARGES = [
    { id: 'hc_1', name: 'Гиперщит', desc: 'Щит +50% на 3с', icon: '✨' },
    { id: 'hc_2', name: 'Гиперурон', desc: 'Урон +30% на 5с', icon: '🔥' },
    { id: 'hc_3', name: 'Гиперскорость', desc: 'Скорость +40% на 4с', icon: '⚡' },
    { id: 'hc_4', name: 'Гиперреген', desc: 'Восстановление 20% HP за 3с', icon: '💚' },
];

// ============================================================
//  ⭐ КАРТЫ
// ============================================================
const MAPS = [
    { id: 'forest', name: '🌳 Лесная', color: 0x2a5a2a, groundColor: 0x3a8a3a, fogColor: 0x2a5a2a },
    { id: 'desert', name: '🏜️ Пустынная', color: 0x8a7a4a, groundColor: 0xbaaa6a, fogColor: 0x8a7a4a },
    { id: 'snow', name: '❄️ Снежная', color: 0x8aaacc, groundColor: 0xccddff, fogColor: 0x8aaacc },
];

// ============================================================
//  ⭐ ВСЕ БОЙЦЫ
// ============================================================
const ALL_BRAWLERS = [
    { id: 'shelly', name: 'ШЕЛЛИ', color: 0xf5c842, baseHp: 10000, baseSpeed: 0.12, unlocked: true, rarity: 'Обычный', icon: '🔫', description: 'Начинающий боец', starPowers: [STAR_POWERS[0], STAR_POWERS[1]], hypercharge: HYPERCHARGES[0] },
    { id: 'brawler_2', name: '???', color: 0xff4444, baseHp: 8500, baseSpeed: 0.14, unlocked: false, rarity: 'Редкий', icon: '❓', description: '???', starPowers: [], hypercharge: null },
    { id: 'brawler_3', name: '???', color: 0x44ff88, baseHp: 11000, baseSpeed: 0.09, unlocked: false, rarity: 'Редкий', icon: '❓', description: '???', starPowers: [], hypercharge: null },
    { id: 'brawler_4', name: '???', color: 0xff44aa, baseHp: 9500, baseSpeed: 0.13, unlocked: false, rarity: 'Эпический', icon: '❓', description: '???', starPowers: [], hypercharge: null },
    { id: 'brawler_5', name: '???', color: 0xff8844, baseHp: 12000, baseSpeed: 0.08, unlocked: false, rarity: 'Эпический', icon: '❓', description: '???', starPowers: [], hypercharge: null },
    { id: 'brawler_6', name: '???', color: 0xff6633, baseHp: 7800, baseSpeed: 0.15, unlocked: false, rarity: 'Редкий', icon: '❓', description: '???', starPowers: [], hypercharge: null },
    { id: 'brawler_7', name: '???', color: 0x44ff44, baseHp: 10500, baseSpeed: 0.11, unlocked: false, rarity: 'Мифический', icon: '❓', description: '???', starPowers: [], hypercharge: null },
    { id: 'brawler_8', name: '???', color: 0xaa44ff, baseHp: 9000, baseSpeed: 0.14, unlocked: false, rarity: 'Суперредкий', icon: '❓', description: '???', starPowers: [], hypercharge: null },
    { id: 'brawler_9', name: '???', color: 0x44ddff, baseHp: 11500, baseSpeed: 0.09, unlocked: false, rarity: 'Эпический', icon: '❓', description: '???', starPowers: [], hypercharge: null },
    { id: 'brawler_10', name: '???', color: 0xffdd44, baseHp: 8200, baseSpeed: 0.15, unlocked: false, rarity: 'Редкий', icon: '❓', description: '???', starPowers: [], hypercharge: null },
    { id: 'sharang', name: 'ШАРАН', color: 0xff44ff, baseHp: 12000, baseSpeed: 0.10, unlocked: false, rarity: 'Легендарный', icon: '👑', description: 'Властелин короны', starPowers: [STAR_POWERS[2], STAR_POWERS[3]], hypercharge: HYPERCHARGES[1] }
];

// ============================================================
//  ⭐ СЕКРЕТНЫЕ ИМЕНА
// ============================================================
const SECRET_NAMES = ['БОРЕЙ', 'ИГНИС', 'ТЕРРА', 'АКВА', 'ВЕНТУС', 'ЛЮМЕН', 'НОКТУС', 'СПЕКТР', 'ОМЕГА', 'ЗЕФИР'];
const SECRET_DESCRIPTIONS = ['Повелитель ветров', 'Мастер огня', 'Страж земли', 'Владыка вод', 'Хранитель неба', 'Сияющий воин', 'Тёмный странник', 'Призрачный охотник', 'Космический боец', 'Буревестник'];
const SECRET_ICONS = ['🌪️', '🔥', '🌍', '🌊', '⚡', '✨', '🌙', '👻', '🚀', '🌀'];
const SECRET_COLORS = [0xff6644, 0xff4400, 0x66dd44, 0x4488ff, 0xdddd44, 0xffdd88, 0x8844ff, 0x44ffdd, 0xff44aa, 0x44ddff];

// ============================================================
//  ⭐ ШАНСЫ ВЫПАДЕНИЯ
// ============================================================
const RARITY_CHANCES = { 'Редкий': 0.40, 'Эпический': 0.20, 'Мифический': 0.09, 'Суперредкий': 0.01, 'Легендарный': 0.00001 };

// ============================================================
//  ⭐ ФУНКЦИИ СОХРАНЕНИЯ
// ============================================================
function saveProgress() {
    try {
        const data = {
            coins: playerData.coins ?? 0,
            powerPoints: playerData.powerPoints ?? 0,
            chests: playerData.chests ?? 0,
            ownedBrawlers: playerData.ownedBrawlers ?? ['shelly'],
            selectedBrawler: playerData.selectedBrawler ?? 'shelly',
            brawlerLevels: playerData.brawlerLevels ?? {},
            brawlerStarPowers: playerData.brawlerStarPowers ?? {},
            brawlerHypercharge: playerData.brawlerHypercharge ?? {},
            version: '3.0',
            timestamp: Date.now()
        };
        localStorage.setItem(SAVE_KEY, JSON.stringify(data));
        console.log('✅ Прогресс сохранён');
        return true;
    } catch (e) {
        console.error('❌ Ошибка сохранения:', e);
        return false;
    }
}

function loadProgress() {
    try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) {
            console.log('ℹ️ Нет сохранённых данных');
            return false;
        }
        const data = JSON.parse(raw);
        playerData.coins = data.coins ?? 0;
        playerData.powerPoints = data.powerPoints ?? 0;
        playerData.chests = data.chests ?? 0;
        playerData.ownedBrawlers = data.ownedBrawlers ?? ['shelly'];
        playerData.selectedBrawler = data.selectedBrawler ?? 'shelly';
        playerData.brawlerLevels = data.brawlerLevels ?? {};
        playerData.brawlerStarPowers = data.brawlerStarPowers ?? {};
        playerData.brawlerHypercharge = data.brawlerHypercharge ?? {};
        console.log('✅ Прогресс загружен');
        return true;
    } catch (e) {
        console.error('❌ Ошибка загрузки:', e);
        return false;
    }
}

window.showSaveInfo = function() {
    try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) { console.log('Нет данных'); return; }
        console.log('📊 Данные:', JSON.parse(raw));
    } catch (e) { console.error(e); }
};

function forceSave() {
    const saved = saveProgress();
    if (!saved) setTimeout(() => saveProgress(), 100);
    return saved;
}

function showSaveStatus(message) {
    const el = document.getElementById('saveStatus');
    if (el) {
        el.textContent = message;
        el.style.display = 'block';
        el.style.opacity = '1';
        setTimeout(() => { el.style.opacity = '0'; setTimeout(() => { el.style.display = 'none'; el.style.opacity = '1'; }, 2000); }, 3000);
    }
}

// ============================================================
//  ⭐ ИНИЦИАЛИЗАЦИЯ БОЙЦОВ
// ============================================================
function initBrawlers() {
    ALL_BRAWLERS.forEach((b, index) => {
        if (index >= 1 && index <= 10) {
            const secretIdx = index - 1;
            b.name = '???';
            b.icon = '❓';
            b.description = '???';
            b.baseSpeed = 0.08 + Math.random() * 0.07;
            b.baseHp = 7500 + Math.floor(Math.random() * 5000);
            b.color = SECRET_COLORS[secretIdx % SECRET_COLORS.length];
            b.starPowers = [STAR_POWERS[Math.floor(Math.random() * STAR_POWERS.length)], STAR_POWERS[Math.floor(Math.random() * STAR_POWERS.length)]];
            b.hypercharge = HYPERCHARGES[Math.floor(Math.random() * HYPERCHARGES.length)];
        }
        if (b.id === 'sharang') { b.baseSpeed = 0.08 + Math.random() * 0.07; }
        
        playerData.brawlerLevels[b.id] = playerData.brawlerLevels[b.id] || 1;
        playerData.brawlerStarPowers[b.id] = playerData.brawlerStarPowers[b.id] || [];
        playerData.brawlerHypercharge[b.id] = playerData.brawlerHypercharge[b.id] || false;
        
        const level = playerData.brawlerLevels[b.id] || 1;
        const hpMultiplier = 1 + (level - 1) * HP_PER_LEVEL;
        const speedMultiplier = 1 + (level - 1) * SPEED_PER_LEVEL;
        
        playerData.brawlerStats[b.id] = {
            hp: Math.floor(b.baseHp * hpMultiplier),
            speed: Math.round((b.baseSpeed * speedMultiplier) * 1000) / 1000,
            unlocked: b.unlocked || playerData.ownedBrawlers.includes(b.id),
            name: b.name,
            color: b.color,
            rarity: b.rarity,
            icon: b.icon,
            description: b.description,
            baseHp: b.baseHp,
            baseSpeed: b.baseSpeed,
            starPowers: b.starPowers || [],
            hypercharge: b.hypercharge || null,
            level: level,
            maxLevel: LEVELS
        };
    });
}

// ============================================================
//  ⭐ ФУНКЦИИ ПРОКАЧКИ
// ============================================================
function getUpgradeCost(brawlerId) {
    const level = playerData.brawlerLevels[brawlerId] || 1;
    if (level >= LEVELS) return Infinity;
    return UPGRADE_COST[level] || 999;
}

function upgradeBrawler(brawlerId) {
    const level = playerData.brawlerLevels[brawlerId] || 1;
    if (level >= LEVELS) { alert('⚠️ Максимальный уровень!'); return false; }
    const cost = getUpgradeCost(brawlerId);
    if (playerData.powerPoints < cost) { alert(`❌ Нужно ${cost}⭐`); return false; }
    
    playerData.powerPoints -= cost;
    playerData.brawlerLevels[brawlerId] = level + 1;
    
    const b = ALL_BRAWLERS.find(b => b.id === brawlerId);
    if (b) {
        const newLevel = playerData.brawlerLevels[brawlerId];
        const hpMultiplier = 1 + (newLevel - 1) * HP_PER_LEVEL;
        const speedMultiplier = 1 + (newLevel - 1) * SPEED_PER_LEVEL;
        playerData.brawlerStats[brawlerId].hp = Math.floor(b.baseHp * hpMultiplier);
        playerData.brawlerStats[brawlerId].speed = Math.round((b.baseSpeed * speedMultiplier) * 1000) / 1000;
        playerData.brawlerStats[brawlerId].level = newLevel;
    }
    
    forceSave();
    showSaveStatus(`✅ Уровень ${playerData.brawlerLevels[brawlerId]}`);
    updateUI();
    return true;
}

// ============================================================
//  ⭐ РАСКРЫТИЕ БОЙЦА
// ============================================================
function revealSecretBrawler(brawlerId) {
    const b = ALL_BRAWLERS.find(b => b.id === brawlerId);
    if (!b) return;
    const idx = ALL_BRAWLERS.indexOf(b);
    if (idx >= 1 && idx <= 10) {
        const secretIdx = idx - 1;
        b.name = SECRET_NAMES[secretIdx % SECRET_NAMES.length];
        b.icon = SECRET_ICONS[secretIdx % SECRET_ICONS.length];
        b.description = SECRET_DESCRIPTIONS[secretIdx % SECRET_DESCRIPTIONS.length];
        b.color = SECRET_COLORS[secretIdx % SECRET_COLORS.length];
    }
    playerData.brawlerLevels[b.id] = 1;
    playerData.brawlerStarPowers[b.id] = [];
    playerData.brawlerHypercharge[b.id] = false;
    const hpMultiplier = 1 + (1 - 1) * HP_PER_LEVEL;
    const speedMultiplier = 1 + (1 - 1) * SPEED_PER_LEVEL;
    playerData.brawlerStats[b.id] = {
        hp: Math.floor(b.baseHp * hpMultiplier),
        speed: Math.round((b.baseSpeed * speedMultiplier) * 1000) / 1000,
        unlocked: true,
        name: b.name,
        color: b.color,
        rarity: b.rarity,
        icon: b.icon,
        description: b.description,
        baseHp: b.baseHp,
        baseSpeed: b.baseSpeed,
        starPowers: b.starPowers || [],
        hypercharge: b.hypercharge || null,
        level: 1,
        maxLevel: LEVELS
    };
    playerData.ownedBrawlers.push(b.id);
    forceSave();
    showSaveStatus(`🎉 Новый боец ${b.name}!`);
    updateUI();
}

// ============================================================
//  ⭐ ОТКРЫТИЕ ЯЩИКА
// ============================================================
function getRandomRarity() {
    const roll = Math.random();
    let cumulative = 0;
    for (const [rarity, chance] of Object.entries(RARITY_CHANCES)) {
        cumulative += chance;
        if (roll <= cumulative) return rarity;
    }
    return 'Редкий';
}

function getBrawlerByRarity(rarity) {
    const available = ALL_BRAWLERS.filter(b => !playerData.ownedBrawlers.includes(b.id) && b.rarity === rarity && b.id !== 'shelly');
    if (available.length === 0) return null;
    return available[Math.floor(Math.random() * available.length)];
}

function openChest() {
    if (playerData.chests <= 0) return;
    playerData.chests--;
    updateUI();
    
    const overlay = document.getElementById('chestOpenOverlay');
    const result = document.getElementById('chestResult');
    const closeBtn = document.getElementById('chestCloseBtn');
    
    overlay.classList.add('show');
    result.innerHTML = '🎁 Открытие...';
    closeBtn.classList.remove('show');
    
    setTimeout(() => {
        const lockedBrawlers = ALL_BRAWLERS.filter(b => !playerData.ownedBrawlers.includes(b.id) && b.id !== 'shelly');
        let drop = null;
        let isNewBrawler = false;
        
        if (lockedBrawlers.length > 0) {
            const rarity = getRandomRarity();
            const brawler = getBrawlerByRarity(rarity);
            if (brawler) {
                revealSecretBrawler(brawler.id);
                drop = { type: 'brawler', brawler: brawler, icon: brawler.icon || '⭐', name: `НОВЫЙ БОЕЦ: ${brawler.name}! 🎉`, rarity: brawler.rarity, legendary: brawler.rarity === 'Легендарный' };
                isNewBrawler = true;
            }
        }
        
        if (!drop) {
            const dropRoll = Math.random();
            if (dropRoll < 0.50) {
                const amounts = [50, 75, 100, 150];
                drop = { type: 'coins', amount: amounts[Math.floor(Math.random() * amounts.length)], icon: '🪙', name: `${amounts[Math.floor(Math.random() * amounts.length)]} монет` };
            } else if (dropRoll < 0.80) {
                const amounts = [10, 15, 20, 30];
                drop = { type: 'power', amount: amounts[Math.floor(Math.random() * amounts.length)], icon: '⭐', name: `${amounts[Math.floor(Math.random() * amounts.length)]} очков силы` };
            } else {
                const amounts = [20, 30, 50];
                drop = { type: 'coins', amount: amounts[Math.floor(Math.random() * amounts.length)], icon: '🪙', name: `${amounts[Math.floor(Math.random() * amounts.length)]} монет (редкий)` };
            }
        }
        
        if (drop.type === 'coins') playerData.coins += drop.amount;
        else if (drop.type === 'power') playerData.powerPoints += drop.amount;
        
        forceSave();
        updateUI();
        
        const rarityColors = { 'Обычный': '#aaaaaa', 'Редкий': '#4488ff', 'Суперредкий': '#aa44ff', 'Эпический': '#ff44aa', 'Мифический': '#ff8844', 'Легендарный': '#ffd700' };
        const rarityColor = rarityColors[drop.rarity] || 'white';
        const isLegendary = drop.legendary || drop.rarity === 'Легендарный';
        
        let html = `<div style="font-size:60px;margin-bottom:10px;">${drop.icon}</div><div style="color:${isLegendary ? '#ffd700' : 'white'};font-size:${isLegendary ? '32px' : '28px'};">${drop.name}</div>`;
        if (isNewBrawler) {
            html += `<div style="font-size:16px;color:${rarityColor};margin-top:6px;">⭐ Редкость: ${drop.rarity}${drop.rarity === 'Легендарный' ? ' 🌟' : ''}</div>
                <div style="font-size:14px;color:rgba(255,255,255,0.5);margin-top:4px;">❤️ ${drop.brawler.baseHp} HP • ⚡ ${drop.brawler.baseSpeed.toFixed(3)} скорость</div>
                <div style="font-size:14px;color:rgba(255,255,255,0.3);margin-top:4px;">${drop.brawler.description || ''}</div>`;
        }
        result.innerHTML = html;
        closeBtn.classList.add('show');
    }, 1200);
}

// ============================================================
//  ⭐ ОБНОВЛЕНИЕ UI
// ============================================================
function updateUI() {
    const resCoins = document.getElementById('resCoins');
    const resPower = document.getElementById('resPower');
    const resChests = document.getElementById('resChests');
    const chestCountDisplay = document.getElementById('chestCountDisplay');
    const chestBadge = document.getElementById('chestBadge');
    const lobbySelectedBrawler = document.getElementById('lobbySelectedBrawler');
    
    if (resCoins) resCoins.textContent = playerData.coins;
    if (resPower) resPower.textContent = playerData.powerPoints;
    if (resChests) resChests.textContent = playerData.chests;
    if (chestCountDisplay) chestCountDisplay.textContent = playerData.chests;
    if (chestBadge) chestBadge.textContent = playerData.chests;
    
    const brawler = playerData.brawlerStats[playerData.selectedBrawler];
    if (lobbySelectedBrawler) lobbySelectedBrawler.textContent = brawler ? brawler.name : 'ШЕЛЛИ';
    
    renderBrawlersGrid();
}

function renderBrawlersGrid() {
    const grid = document.getElementById('brawlersGrid');
    if (!grid) return;
    grid.innerHTML = '';
    
    ALL_BRAWLERS.forEach((b) => {
        const isUnlocked = playerData.ownedBrawlers.includes(b.id);
        const isSelected = playerData.selectedBrawler === b.id;
        const stats = playerData.brawlerStats[b.id];
        const level = playerData.brawlerLevels[b.id] || 1;
        const isMaxLevel = level >= LEVELS;
        const upgradeCost = getUpgradeCost(b.id);
        const canUpgrade = playerData.powerPoints >= upgradeCost && !isMaxLevel && isUnlocked;
        
        const card = document.createElement('div');
        card.className = 'brawler-card2' + (isSelected ? ' selected2' : '');
        card.dataset.brawler = b.id;
        
        const preview = document.createElement('div');
        preview.className = 'preview2';
        if (b.id === 'shelly') { preview.classList.add('shelly2'); preview.textContent = '🔫'; }
        else if (b.id === 'sharang') { preview.classList.add('sharang2'); preview.textContent = isUnlocked ? '👑' : '❓'; }
        else {
            preview.classList.add('mystery');
            preview.textContent = isUnlocked ? stats.icon || '⭐' : '❓';
            if (isUnlocked) { preview.style.background = `radial-gradient(circle, #${stats.color.toString(16).padStart(6, '0')}, #${(stats.color & 0x888888).toString(16).padStart(6, '0')})`; }
            else { preview.style.background = 'radial-gradient(circle, #444, #222)'; }
        }
        card.appendChild(preview);
        
        const nameDiv = document.createElement('div');
        nameDiv.className = 'name2';
        nameDiv.textContent = isUnlocked ? stats.name : '???';
        card.appendChild(nameDiv);
        
        const levelDiv = document.createElement('div');
        levelDiv.className = 'level-display';
        levelDiv.textContent = isUnlocked ? `📊 Уровень ${level}/${LEVELS}` : '🔒 Заблокирован';
        card.appendChild(levelDiv);
        
        const rarityColors = { 'Обычный': '#aaaaaa', 'Редкий': '#4488ff', 'Суперредкий': '#aa44ff', 'Эпический': '#ff44aa', 'Мифический': '#ff8844', 'Легендарный': '#ffd700' };
        const rarity = document.createElement('div');
        rarity.className = 'rarity2';
        if (isUnlocked) { rarity.innerHTML = `⭐ <span style="color:${rarityColors[stats.rarity] || '#aaaaaa'}">${stats.rarity}</span>`; }
        else { rarity.textContent = '🔒 Заблокирован'; }
        card.appendChild(rarity);
        
        const statsDiv = document.createElement('div');
        statsDiv.className = 'stats2';
        if (isUnlocked) { statsDiv.textContent = `❤️ ${stats.hp} HP • ⚡ ${stats.speed.toFixed(3)}`; }
        else { statsDiv.textContent = 'Выпадает из ящиков'; }
        card.appendChild(statsDiv);
        
        if (isUnlocked && stats.starPowers && stats.starPowers.length > 0) {
            const spDiv = document.createElement('div');
            spDiv.className = 'star-powers';
            stats.starPowers.forEach((sp) => {
                const isUnlockedSP = playerData.brawlerStarPowers[b.id]?.includes(sp.id) || false;
                const badge = document.createElement('span');
                badge.className = 'star-power-badge' + (isUnlockedSP ? ' unlocked' : '');
                badge.textContent = `${sp.icon} ${isUnlockedSP ? '✅' : '🔒'}`;
                badge.title = `${sp.name}: ${sp.desc}`;
                spDiv.appendChild(badge);
            });
            card.appendChild(spDiv);
        }
        
        if (isUnlocked && stats.hypercharge) {
            const hcDiv = document.createElement('div');
            hcDiv.style.marginTop = '2px';
            const isUnlockedHC = playerData.brawlerHypercharge[b.id] || false;
            const badge = document.createElement('span');
            badge.className = 'hypercharge-badge' + (isUnlockedHC ? ' unlocked' : '');
            badge.textContent = `${stats.hypercharge.icon} Гиперзаряд ${isUnlockedHC ? '✅' : '🔒'}`;
            badge.title = `${stats.hypercharge.name}: ${stats.hypercharge.desc}`;
            hcDiv.appendChild(badge);
            card.appendChild(hcDiv);
        }
        
        const selectBtn = document.createElement('button');
        selectBtn.className = 'select-btn2' + (isSelected ? ' active2' : '');
        selectBtn.textContent = isSelected ? 'Выбран' : (isUnlocked ? 'Выбрать' : '🔒');
        selectBtn.disabled = !isUnlocked;
        selectBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isUnlocked) {
                playerData.selectedBrawler = b.id;
                forceSave();
                updateUI();
            }
        });
        card.appendChild(selectBtn);
        
        if (isUnlocked) {
            const upgradeBtn = document.createElement('button');
            upgradeBtn.className = 'upgrade-btn' + (isMaxLevel ? ' max-level' : '');
            if (isMaxLevel) { upgradeBtn.textContent = '⭐ MAX'; upgradeBtn.disabled = true; }
            else { upgradeBtn.textContent = `⬆ ${upgradeCost}⭐`; upgradeBtn.disabled = !canUpgrade; }
            upgradeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (upgradeBrawler(b.id)) { updateUI(); }
            });
            card.appendChild(upgradeBtn);
        }
        
        grid.appendChild(card);
    });
}

// ============================================================
//  ⭐ ВКЛАДКИ (ГЛАВНОЕ ИСПРАВЛЕНИЕ)
// ============================================================
function initTabs() {
    const tabs = document.querySelectorAll('.lobby-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    console.log(`🔍 Найдено вкладок: ${tabs.length}`);
    
    if (tabs.length === 0) {
        console.warn('⚠️ Вкладки не найдены!');
        return;
    }
    
    tabs.forEach((tab) => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const tabName = this.dataset.tab;
            console.log(`🔄 Переключение на: ${tabName}`);
            
            // Убираем активный класс со всех вкладок
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Скрываем всё содержимое
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Показываем нужное содержимое
            const targetId = 'tab' + tabName.charAt(0).toUpperCase() + tabName.slice(1);
            const target = document.getElementById(targetId);
            if (target) {
                target.classList.add('active');
                console.log(`✅ Показана вкладка: ${targetId}`);
            } else {
                console.warn(`⚠️ Контент не найден: ${targetId}`);
            }
        });
    });
    
    // Убеждаемся, что первая вкладка активна
    const firstTab = document.querySelector('.lobby-tab.active');
    if (firstTab) {
        firstTab.click();
    } else if (tabs.length > 0) {
        tabs[0].click();
    }
}

// ============================================================
//  ⭐ 3D ИГРА
// ============================================================
let scene3D = null, camera3D = null, renderer3D = null, playerMesh3D = null;
let enemies3D = [], bullets3D = [], enemyBullets3D = [], gasRing3D = null;
let particles3D = [];
let animationId3D = null, isGameRunning3D = false, gameState = {};
let mouseWorldPos = new THREE.Vector3(0, 0, 0);
let currentMapData = MAPS[0];
let selectedMode = 'showdown';
let currentMap = 0;
let isGameRunning = false;

const keys = { up: false, down: false, left: false, right: false };

const enemyTemplates3D = [
    { name: 'КОЛЬТ', color: 0x4488ff, hat: 'cowboy' },
    { name: 'БУЛЛ', color: 0xff4444, hat: 'horns' },
    { name: 'ПОКО', color: 0x44ff88, hat: 'sombrero' },
    { name: 'ДЖЕККИ', color: 0xff44aa, hat: 'helmet' },
    { name: 'БРОК', color: 0xff8844, hat: 'bandana' },
    { name: 'ДИНА', color: 0xff6633, hat: 'pirate' },
    { name: 'СПАЙК', color: 0x44ff44, hat: 'spikes' },
    { name: 'КРОУ', color: 0xaa44ff, hat: 'hood' },
    { name: 'ЛЕОН', color: 0x44ddff, hat: 'mask' },
    { name: 'СЭНДИ', color: 0xffdd44, hat: 'cap' },
    { name: 'ШАРАН', color: 0xff44ff, hat: 'crown' }
];

class AudioManager {
    constructor() {
        this.enabled = true;
        this.ctx = null;
        try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
    }
    playShoot() {
        if (!this.ctx || !this.enabled) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain); gain.connect(this.ctx.destination);
            osc.frequency.setValueAtTime(800, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
            osc.start(this.ctx.currentTime);
            osc.stop(this.ctx.currentTime + 0.1);
        } catch (e) {}
    }
    playHit() {
        if (!this.ctx || !this.enabled) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain); gain.connect(this.ctx.destination);
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(300, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
            osc.start(this.ctx.currentTime);
            osc.stop(this.ctx.currentTime + 0.15);
        } catch (e) {}
    }
    playKill() {
        if (!this.ctx || !this.enabled) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain); gain.connect(this.ctx.destination);
            osc.type = 'square';
            osc.frequency.setValueAtTime(500, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
            osc.start(this.ctx.currentTime);
            osc.stop(this.ctx.currentTime + 0.15);
        } catch (e) {}
    }
    playWin() {
        if (!this.ctx || !this.enabled) return;
        try {
            const notes = [523, 659, 784, 1047];
            notes.forEach((freq, i) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.connect(gain); gain.connect(this.ctx.destination);
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.12);
                gain.gain.setValueAtTime(0.1, this.ctx.currentTime + i * 0.12);
                gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + i * 0.12 + 0.15);
                osc.start(this.ctx.currentTime + i * 0.12);
                osc.stop(this.ctx.currentTime + i * 0.12 + 0.15);
            });
        } catch (e) {}
    }
    playDefeat() {
        if (!this.ctx || !this.enabled) return;
        try {
            const notes = [400, 350, 300, 250];
            notes.forEach((freq, i) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.connect(gain); gain.connect(this.ctx.destination);
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.15);
                gain.gain.setValueAtTime(0.08, this.ctx.currentTime + i * 0.15);
                gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + i * 0.15 + 0.15);
                osc.start(this.ctx.currentTime + i * 0.15);
                osc.stop(this.ctx.currentTime + i * 0.15 + 0.15);
            });
        } catch (e) {}
    }
    playChestOpen() {
        if (!this.ctx || !this.enabled) return;
        try {
            const notes = [500, 600, 700, 800];
            notes.forEach((freq, i) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.connect(gain); gain.connect(this.ctx.destination);
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.08);
                gain.gain.setValueAtTime(0.08, this.ctx.currentTime + i * 0.08);
                gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + i * 0.08 + 0.1);
                osc.start(this.ctx.currentTime + i * 0.08);
                osc.stop(this.ctx.currentTime + i * 0.08 + 0.1);
            });
        } catch (e) {}
    }
}

const audio = new AudioManager();

// ============================================================
//  ⭐ ФУНКЦИИ 3D
// ============================================================
function createCharacter3D(color, isPlayer = false, hatType = null, brawlerType = 'shelly') {
    const group = new THREE.Group();
    const bodyGeo = new THREE.SphereGeometry(1, 16, 16);
    const bodyMat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.4, metalness: 0.3 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.8; body.castShadow = true; group.add(body);
    
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const pupilMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const eyeGeo = new THREE.SphereGeometry(0.3, 8, 8);
    const pupilGeo = new THREE.SphereGeometry(0.15, 8, 8);
    
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat); eyeL.position.set(-0.4, 1.05, 0.85); group.add(eyeL);
    const pupilL = new THREE.Mesh(pupilGeo, pupilMat); pupilL.position.set(-0.4, 1.05, 1.0); group.add(pupilL);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat); eyeR.position.set(0.4, 1.05, 0.85); group.add(eyeR);
    const pupilR = new THREE.Mesh(pupilGeo, pupilMat); pupilR.position.set(0.4, 1.05, 1.0); group.add(pupilR);
    
    const mouthGeo = new THREE.TorusGeometry(0.25, 0.05, 6, 12, Math.PI);
    const mouthMat = new THREE.MeshStandardMaterial({ color: 0x4a2a0a });
    const mouth = new THREE.Mesh(mouthGeo, mouthMat);
    mouth.position.set(0, 0.85, 0.9); mouth.rotation.x = 0.1; group.add(mouth);

    if (isPlayer && brawlerType === 'shelly') {
        const hatMat = new THREE.MeshStandardMaterial({ color: 0xcc2233 });
        const hat = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 1.0, 0.3, 8), hatMat);
        hat.position.set(0, 1.5, 0); hat.rotation.x = 0.1; group.add(hat);
    } else if (isPlayer && brawlerType === 'sharang') {
        const crownMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8, roughness: 0.2 });
        const crownBase = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.7, 0.2, 8), crownMat);
        crownBase.position.set(0, 1.5, 0); group.add(crownBase);
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2;
            const spike = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.3, 4), crownMat);
            spike.position.set(0.55 * Math.cos(angle), 1.7, 0.55 * Math.sin(angle));
            group.add(spike);
        }
    } else if (hatType === 'crown') {
        const crownMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8, roughness: 0.2 });
        const crownBase = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.7, 0.2, 8), crownMat);
        crownBase.position.set(0, 1.5, 0); group.add(crownBase);
    } else if (hatType === 'cowboy') {
        const hatMat = new THREE.MeshStandardMaterial({ color: 0x4a3a2a });
        const hat = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.0, 0.15, 8), hatMat);
        hat.position.set(0, 1.45, 0); group.add(hat);
    } else if (hatType === 'horns') {
        const hornMat = new THREE.MeshStandardMaterial({ color: 0xcc8844 });
        for (let side of [-1, 1]) {
            const horn = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.5, 6), hornMat);
            horn.position.set(side * 0.6, 1.4, 0.2); group.add(horn);
        }
    } else if (hatType === 'sombrero') {
        const hatMat = new THREE.MeshStandardMaterial({ color: 0x44aa66 });
        const hat = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.1, 0.15, 8), hatMat);
        hat.position.set(0, 1.45, 0); group.add(hat);
    } else if (hatType === 'helmet') {
        const hatMat = new THREE.MeshStandardMaterial({ color: 0x8844aa, metalness: 0.3 });
        const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.6, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2), hatMat);
        helmet.position.set(0, 1.5, 0); helmet.scale.set(1, 0.7, 1); group.add(helmet);
    } else if (hatType === 'bandana') {
        const hatMat = new THREE.MeshStandardMaterial({ color: 0xff8844 });
        const bandana = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.1, 6, 12), hatMat);
        bandana.position.set(0, 1.35, 0.1); group.add(bandana);
    } else if (hatType === 'pirate') {
        const hatMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
        const bandana2 = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.08, 6, 12), hatMat);
        bandana2.position.set(0, 1.35, 0.1); group.add(bandana2);
    } else if (hatType === 'spikes') {
        const spikeMat = new THREE.MeshStandardMaterial({ color: 0x33aa33 });
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const spike = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.3, 4), spikeMat);
            spike.position.set(0.7 * Math.cos(angle), 0.8 + 0.3 * Math.sin(angle), 0.7 * Math.sin(angle));
            group.add(spike);
        }
    } else if (hatType === 'hood') {
        const hoodMat = new THREE.MeshStandardMaterial({ color: 0x6644aa });
        const hood = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2), hoodMat);
        hood.position.set(0, 1.5, 0); hood.scale.set(1.2, 0.6, 1.2); group.add(hood);
    } else if (hatType === 'mask') {
        const maskMat = new THREE.MeshStandardMaterial({ color: 0x3388cc });
        const mask = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 8), maskMat);
        mask.position.set(0, 1.3, 0.9); mask.scale.set(1.2, 0.6, 0.3); group.add(mask);
    } else if (hatType === 'cap') {
        const hatMat = new THREE.MeshStandardMaterial({ color: 0xddbb44 });
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.7, 0.15, 8), hatMat);
        cap.position.set(0, 1.45, 0.1); group.add(cap);
    }

    if (isPlayer) {
        const barrelMat = new THREE.MeshStandardMaterial({ color: 0x6a4a2a, metalness: 0.6 });
        const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.8, 6), barrelMat);
        barrel.position.set(0.4, 0.8, 1.0); barrel.rotation.x = Math.PI / 2; group.add(barrel);
    }
    return group;
}

function createParticles(position, color, count = 20, speed = 0.1) {
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const velocities = [];
    const c = new THREE.Color(color);
    
    for (let i = 0; i < count; i++) {
        positions[i*3] = position.x + (Math.random() - 0.5) * 0.5;
        positions[i*3+1] = position.y + (Math.random() - 0.5) * 0.5 + 0.3;
        positions[i*3+2] = position.z + (Math.random() - 0.5) * 0.5;
        colors[i*3] = c.r + (Math.random() - 0.5) * 0.2;
        colors[i*3+1] = c.g + (Math.random() - 0.5) * 0.2;
        colors[i*3+2] = c.b + (Math.random() - 0.5) * 0.2;
        velocities.push({ x: (Math.random() - 0.5) * speed, y: Math.random() * speed * 0.5 + 0.05, z: (Math.random() - 0.5) * speed });
    }
    
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particleMat = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene3D.add(particleSystem);
    
    particles3D.push({ mesh: particleSystem, velocities: velocities, life: 60, maxLife: 60 });
}

function updateParticles() {
    for (let i = particles3D.length - 1; i >= 0; i--) {
        const p = particles3D[i];
        p.life--;
        const pos = p.mesh.geometry.attributes.position;
        const array = pos.array;
        for (let j = 0; j < array.length / 3; j++) {
            array[j*3] += p.velocities[j].x;
            array[j*3+1] += p.velocities[j].y;
            array[j*3+2] += p.velocities[j].z;
            p.velocities[j].y -= 0.002;
        }
        pos.needsUpdate = true;
        p.mesh.material.opacity = p.life / p.maxLife;
        if (p.life <= 0) {
            scene3D.remove(p.mesh);
            p.mesh.geometry.dispose();
            p.mesh.material.dispose();
            particles3D.splice(i, 1);
        }
    }
}

function createGasRing3D(radius) {
    if (gasRing3D) { scene3D.remove(gasRing3D); gasRing3D.geometry.dispose(); gasRing3D.material.dispose(); gasRing3D = null; }
    const geo = new THREE.RingGeometry(radius - 0.5, radius + 1.5, 64);
    const mat = new THREE.MeshBasicMaterial({ color: 0xff3333, transparent: true, opacity: 0.25, side: THREE.DoubleSide, depthWrite: false });
    gasRing3D = new THREE.Mesh(geo, mat);
    gasRing3D.rotation.x = -Math.PI / 2;
    gasRing3D.position.y = 0.1;
    scene3D.add(gasRing3D);
    const borderGeo = new THREE.RingGeometry(radius - 0.3, radius + 0.3, 64);
    const borderMat = new THREE.MeshBasicMaterial({ color: 0xff4444, transparent: true, opacity: 0.6, side: THREE.DoubleSide, depthWrite: false });
    const border = new THREE.Mesh(borderGeo, borderMat);
    border.rotation.x = -Math.PI / 2;
    border.position.y = 0.15;
    scene3D.add(border);
    return border;
}

function spawnEnemy3D() {
    const maxEnemies = selectedMode === 'duel' ? 1 : 11;
    if (gameState.enemiesSpawned >= maxEnemies) return;
    const side = Math.floor(Math.random() * 4);
    const pad = 5;
    let x, z;
    if (side === 0) { x = (Math.random() - 0.5) * 50; z = -30 - pad; }
    else if (side === 1) { x = 30 + pad; z = (Math.random() - 0.5) * 50; }
    else if (side === 2) { x = (Math.random() - 0.5) * 50; z = 30 + pad; }
    else { x = -30 - pad; z = (Math.random() - 0.5) * 50; }
    
    let index = selectedMode === 'duel' ? 10 : gameState.enemiesSpawned % enemyTemplates3D.length;
    const template = enemyTemplates3D[index];
    const mesh = createCharacter3D(template.color, false, template.hat);
    mesh.scale.set(1.1, 1.1, 1.1);
    mesh.position.set(x, 0, z);
    scene3D.add(mesh);
    
    const hpBonus = selectedMode === 'duel' ? 200 : 0;
    enemies3D.push({ 
        mesh, x, z, 
        hp: 40 + Math.random() * 30 + hpBonus, 
        maxHp: 70 + hpBonus, 
        speed: 0.04 + Math.random() * 0.025 + (selectedMode === 'duel' ? 0.02 : 0),
        angle: 0, shootCooldown: 0, 
        shootDelay: selectedMode === 'duel' ? 20 : (30 + Math.floor(Math.random() * 40)),
        template
    });
    gameState.enemiesSpawned++;
    gameState.enemiesRemaining = enemies3D.length;
    updateGameUI();
}

function updateGameUI() {
    document.getElementById('gameHp').textContent = Math.floor(gameState.hp);
    document.getElementById('gameKills').textContent = gameState.kills;
    document.getElementById('gameEnemies').textContent = gameState.enemiesRemaining;
    document.getElementById('gameEnemiesBottom').textContent = gameState.enemiesRemaining;
}

function shootBullet3D() {
    if (gameState.isOver || !isGameRunning3D || !renderer3D) return;
    audio.playShoot();
    const dx = mouseWorldPos.x - gameState.playerPos.x;
    const dz = mouseWorldPos.z - gameState.playerPos.z;
    const len = Math.hypot(dx, dz);
    if (len < 0.5) return;
    const normX = dx / len, normZ = dz / len;
    const geo = new THREE.SphereGeometry(0.3, 8, 8);
    const mat = new THREE.MeshStandardMaterial({ color: 0xffee44, emissive: 0xffee44, emissiveIntensity: 0.5 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(gameState.playerPos.x + normX * 1.8, 0.3, gameState.playerPos.z + normZ * 1.8);
    scene3D.add(mesh);
    bullets3D.push({ mesh, x: gameState.playerPos.x + normX * 1.8, z: gameState.playerPos.z + normZ * 1.8, vx: normX * 0.3, vz: normZ * 0.3, life: 130 });
    gameState.playerPos.angle = Math.atan2(dz, dx);
    if (playerMesh3D) playerMesh3D.rotation.y = gameState.playerPos.angle;
}

function startGame() {
    if (!playerData.ownedBrawlers.includes(playerData.selectedBrawler)) {
        playerData.selectedBrawler = 'shelly';
        forceSave();
        updateUI();
    }
    document.getElementById('lobbyOverlay').style.display = 'none';
    document.getElementById('gameOverlay').style.display = 'block';
    document.getElementById('defeatOverlay').style.display = 'none';
    document.getElementById('winOverlay').style.display = 'none';
    if (isMobile) { document.getElementById('touchControls').classList.add('show'); document.getElementById('touchHint').classList.add('show'); }
    
    currentMap = Math.floor(Math.random() * MAPS.length);
    currentMapData = MAPS[currentMap];
    
    const brawler = playerData.brawlerStats[playerData.selectedBrawler];
    const isDuel = selectedMode === 'duel';
    gameState = {
        playerPos: { x: 0, z: 0, angle: 0 },
        hp: brawler ? brawler.hp : 10000,
        maxHp: brawler ? brawler.hp : 10000,
        kills: 0,
        enemiesRemaining: isDuel ? 1 : 11,
        enemiesSpawned: 0,
        gasRadius: isDuel ? 40 : 28,
        gasTimer: 0,
        frameCount: 0,
        isOver: false,
        speed: brawler ? brawler.speed : 0.12,
        selectedBrawler: playerData.selectedBrawler,
        mode: selectedMode
    };
    cleanupGame3D();
    initGame3D();
    updateGameUI();
    document.getElementById('gameCanvas').focus();
    window.focus();
    isGameRunning3D = true;
    gameLoop3D();
}

function initGame3D() {
    const container = document.getElementById('gameCanvas');
    const W = 1000, H = 660, WORLD_SIZE = 60;
    scene3D = new THREE.Scene();
    scene3D.background = new THREE.Color(currentMapData.color);
    scene3D.fog = new THREE.Fog(currentMapData.fogColor, 80, 120);
    camera3D = new THREE.PerspectiveCamera(45, W / H, 0.1, 200);
    camera3D.position.set(35, 45, 35);
    camera3D.lookAt(0, 0, 0);
    renderer3D = new THREE.WebGLRenderer({ antialias: true });
    renderer3D.setSize(W, H);
    renderer3D.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer3D.shadowMap.enabled = true;
    renderer3D.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer3D.toneMapping = THREE.ACESFilmicToneMapping;
    renderer3D.toneMappingExposure = 1.2;
    container.innerHTML = '';
    container.appendChild(renderer3D.domElement);
    renderer3D.domElement.addEventListener('mousemove', handleMouseMove);
    renderer3D.domElement.addEventListener('mousedown', handleMouseDown);
    renderer3D.domElement.addEventListener('contextmenu', (e) => e.preventDefault());

    const ambientLight = new THREE.AmbientLight(0x404060, 0.5);
    scene3D.add(ambientLight);
    const sunLight = new THREE.DirectionalLight(0xffeedd, 1.8);
    sunLight.position.set(30, 40, 20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 120;
    sunLight.shadow.camera.left = -60;
    sunLight.shadow.camera.right = 60;
    sunLight.shadow.camera.top = 60;
    sunLight.shadow.camera.bottom = -60;
    scene3D.add(sunLight);
    const fillLight = new THREE.DirectionalLight(0x4488ff, 0.3);
    fillLight.position.set(-30, 20, -30);
    scene3D.add(fillLight);

    const groundGeo = new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE);
    const groundMat = new THREE.MeshStandardMaterial({ color: currentMapData.groundColor, roughness: 0.8, metalness: 0.1 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, -0.5, 0);
    ground.receiveShadow = true;
    scene3D.add(ground);
    const gridHelper = new THREE.GridHelper(WORLD_SIZE, 20, 0x4a9a4a, 0x4a9a4a);
    gridHelper.position.y = -0.45;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.3;
    scene3D.add(gridHelper);
    createGasRing3D(gameState.gasRadius);

    const brawler = playerData.brawlerStats[gameState.selectedBrawler];
    const color = brawler ? brawler.color : 0xf5c842;
    playerMesh3D = createCharacter3D(color, true, null, gameState.selectedBrawler);
    playerMesh3D.scale.set(1.3, 1.3, 1.3);
    playerMesh3D.position.set(0, 0, 0);
    scene3D.add(playerMesh3D);
    
    const enemyCount = selectedMode === 'duel' ? 1 : 11;
    for (let i = 0; i < enemyCount; i++) { spawnEnemy3D(); }
}

function handleMouseMove(e) {
    if (!renderer3D) return;
    const rect = renderer3D.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera3D);
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const point = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, point);
    if (point) { mouseWorldPos.copy(point); }
}

function handleMouseDown(e) { e.preventDefault(); shootBullet3D(); }

function cleanupGame3D() {
    if (animationId3D) { cancelAnimationFrame(animationId3D); animationId3D = null; }
    for (const enemy of enemies3D) {
        if (enemy.mesh) { scene3D.remove(enemy.mesh); enemy.mesh.traverse((child) => { if (child.isMesh) { child.geometry.dispose(); if (Array.isArray(child.material)) child.material.forEach(m => m.dispose()); else child.material.dispose(); } }); }
    }
    enemies3D = [];
    for (const b of bullets3D) { if (b.mesh) { scene3D.remove(b.mesh); b.mesh.geometry.dispose(); b.mesh.material.dispose(); } }
    bullets3D = [];
    for (const b of enemyBullets3D) { if (b.mesh) { scene3D.remove(b.mesh); b.mesh.geometry.dispose(); b.mesh.material.dispose(); } }
    enemyBullets3D = [];
    for (const p of particles3D) { scene3D.remove(p.mesh); p.mesh.geometry.dispose(); p.mesh.material.dispose(); }
    particles3D = [];
    if (playerMesh3D) { scene3D.remove(playerMesh3D); playerMesh3D.traverse((child) => { if (child.isMesh) { child.geometry.dispose(); if (Array.isArray(child.material)) child.material.forEach(m => m.dispose()); else child.material.dispose(); } }); playerMesh3D = null; }
    if (gasRing3D) { scene3D.remove(gasRing3D); gasRing3D.geometry.dispose(); gasRing3D.material.dispose(); gasRing3D = null; }
    if (renderer3D) { renderer3D.dispose(); renderer3D.domElement.removeEventListener('mousemove', handleMouseMove); renderer3D.domElement.removeEventListener('mousedown', handleMouseDown); renderer3D.domElement.remove(); renderer3D = null; }
    if (scene3D) { scene3D.clear(); scene3D = null; }
    camera3D = null;
    isGameRunning3D = false;
}

function exitGame() {
    isGameRunning3D = false;
    if (animationId3D) { cancelAnimationFrame(animationId3D); animationId3D = null; }
    cleanupGame3D();
    document.getElementById('gameOverlay').style.display = 'none';
    document.getElementById('defeatOverlay').style.display = 'none';
    document.getElementById('winOverlay').style.display = 'none';
    document.getElementById('lobbyOverlay').style.display = 'flex';
    document.getElementById('touchControls').classList.remove('show');
    document.getElementById('touchHint').classList.remove('show');
    updateUI();
    document.getElementById('gameCanvas').blur();
    isGameRunning = false;
}

function gameLoop3D() {
    if (!isGameRunning3D) return;
    updateGame3D();
    renderer3D.render(scene3D, camera3D);
    animationId3D = requestAnimationFrame(gameLoop3D);
}

function updateGame3D() {
    if (gameState.isOver) return;
    gameState.frameCount++;

    let dx = 0, dz = 0;
    if (keys.up) dz -= 1;
    if (keys.down) dz += 1;
    if (keys.left) dx -= 1;
    if (keys.right) dx += 1;
    if (dx !== 0 || dz !== 0) { const len = Math.hypot(dx, dz); dx /= len; dz /= len; gameState.playerPos.x += dx * gameState.speed; gameState.playerPos.z += dz * gameState.speed; }
    const limit = 28;
    gameState.playerPos.x = Math.max(-limit, Math.min(limit, gameState.playerPos.x));
    gameState.playerPos.z = Math.max(-limit, Math.min(limit, gameState.playerPos.z));
    if (playerMesh3D) { playerMesh3D.position.set(gameState.playerPos.x, 0, gameState.playerPos.z); playerMesh3D.rotation.y = gameState.playerPos.angle; }

    if (selectedMode !== 'duel' && Math.hypot(gameState.playerPos.x, gameState.playerPos.z) > gameState.gasRadius) {
        gameState.hp -= 2; updateGameUI();
        if (gameState.hp <= 0) { gameState.hp = 0; gameState.isOver = true; audio.playDefeat(); showDefeat(); return; }
    }

    if (selectedMode !== 'duel') {
        gameState.gasTimer++;
        if (gameState.gasTimer > 480 && gameState.gasRadius > 7) {
            gameState.gasRadius -= 0.1;
            createGasRing3D(gameState.gasRadius);
            document.getElementById('gameGasWarning').classList.add('show');
            setTimeout(() => document.getElementById('gameGasWarning').classList.remove('show'), 1500);
        }
        if (gameState.gasTimer > 500) gameState.gasTimer = 0;
    }

    for (let i = bullets3D.length - 1; i >= 0; i--) {
        const b = bullets3D[i];
        b.x += b.vx; b.z += b.vz; b.life--;
        b.mesh.position.set(b.x, 0.3, b.z);
        if (Math.abs(b.x) > 35 || Math.abs(b.z) > 35 || b.life <= 0) {
            scene3D.remove(b.mesh); b.mesh.geometry.dispose(); b.mesh.material.dispose();
            bullets3D.splice(i, 1); continue;
        }
        let used = false;
        for (let j = enemies3D.length - 1; j >= 0; j--) {
            const e = enemies3D[j];
            if (Math.hypot(b.x - e.x, b.z - e.z) < 1.4) {
                e.hp -= 22;
                audio.playHit();
                createParticles(new THREE.Vector3(b.x, 0.3, b.z), 0xffdd44, 15, 0.08);
                scene3D.remove(b.mesh); b.mesh.geometry.dispose(); b.mesh.material.dispose();
                bullets3D.splice(i, 1);
                if (e.hp <= 0) {
                    audio.playKill();
                    createParticles(new THREE.Vector3(e.x, 0.3, e.z), e.template.color, 30, 0.15);
                    scene3D.remove(e.mesh);
                    enemies3D.splice(j, 1);
                    gameState.kills++;
                    gameState.enemiesRemaining = enemies3D.length;
                    updateGameUI();
                    const maxEnemies = selectedMode === 'duel' ? 1 : 11;
                    if (enemies3D.length === 0 && gameState.enemiesSpawned >= maxEnemies) {
                        gameState.isOver = true;
                        audio.playWin();
                        playerData.coins += selectedMode === 'duel' ? 80 : 50;
                        playerData.powerPoints += selectedMode === 'duel' ? 10 : 5;
                        forceSave();
                        showSaveStatus(`🏆 Победа! +${selectedMode === 'duel' ? 80 : 50}🪙 +${selectedMode === 'duel' ? 10 : 5}⭐`);
                        updateUI();
                        showWin();
                        return;
                    }
                }
                used = true;
                break;
            }
        }
        if (used) { continue; }
    }

    for (const enemy of enemies3D) {
        const dxE = gameState.playerPos.x - enemy.x;
        const dzE = gameState.playerPos.z - enemy.z;
        const distE = Math.hypot(dxE, dzE);
        if (distE > 0.5) { enemy.x += (dxE / distE) * enemy.speed; enemy.z += (dzE / distE) * enemy.speed; }
        enemy.mesh.position.set(enemy.x, 0, enemy.z);
        if (enemy.shootCooldown > 0) enemy.shootCooldown--;
        if (enemy.shootCooldown <= 0 && distE < 20 && distE > 1) {
            enemy.shootCooldown = enemy.shootDelay;
            const normX = dxE / distE, normZ = dzE / distE;
            const geo = new THREE.SphereGeometry(0.25, 8, 8);
            const mat = new THREE.MeshStandardMaterial({ color: 0xff4444, emissive: 0xff4444, emissiveIntensity: 0.3 });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(enemy.x + normX * 1.5, 0.3, enemy.z + normZ * 1.5);
            scene3D.add(mesh);
            enemyBullets3D.push({ mesh, x: enemy.x + normX * 1.5, z: enemy.z + normZ * 1.5, vx: normX * 0.18, vz: normZ * 0.18, life: 160 });
            enemy.angle = Math.atan2(dzE, dxE);
            enemy.mesh.rotation.y = enemy.angle;
        }
    }

    for (let i = enemyBullets3D.length - 1; i >= 0; i--) {
        const b = enemyBullets3D[i];
        b.x += b.vx; b.z += b.vz; b.life--;
        b.mesh.position.set(b.x, 0.3, b.z);
        if (Math.abs(b.x) > 35 || Math.abs(b.z) > 35 || b.life <= 0) {
            scene3D.remove(b.mesh); b.mesh.geometry.dispose(); b.mesh.material.dispose();
            enemyBullets3D.splice(i, 1); continue;
        }
        if (Math.hypot(b.x - gameState.playerPos.x, b.z - gameState.playerPos.z) < 1.4) {
            gameState.hp -= 10;
            audio.playHit();
            createParticles(new THREE.Vector3(b.x, 0.3, b.z), 0xff4444, 15, 0.08);
            updateGameUI();
            scene3D.remove(b.mesh); b.mesh.geometry.dispose(); b.mesh.material.dispose();
            enemyBullets3D.splice(i, 1);
            if (gameState.hp <= 0) { gameState.hp = 0; gameState.isOver = true; audio.playDefeat(); showDefeat(); return; }
        }
    }

    updateParticles();

    if (camera3D) {
        const target = new THREE.Vector3(gameState.playerPos.x, 0, gameState.playerPos.z);
        camera3D.position.lerp(new THREE.Vector3(gameState.playerPos.x + 35, 40, gameState.playerPos.z + 35), 0.05);
        camera3D.lookAt(target);
    }
}

function showDefeat() {
    document.getElementById('defeatKills').textContent = gameState.kills;
    document.getElementById('defeatRank').textContent = '#' + (gameState.enemiesRemaining + 1);
    document.getElementById('defeatOverlay').style.display = 'flex';
    isGameRunning3D = false;
    if (animationId3D) { cancelAnimationFrame(animationId3D); animationId3D = null; }
}

function showWin() {
    document.getElementById('winKills').textContent = gameState.kills;
    document.getElementById('winOverlay').style.display = 'flex';
    forceSave();
    isGameRunning3D = false;
    if (animationId3D) { cancelAnimationFrame(animationId3D); animationId3D = null; }
}

// ============================================================
//  ⭐ КЛАВИШИ
// ============================================================
window.addEventListener('keydown', (e) => {
    const key = e.key;
    if (key === 'ArrowUp') { keys.up = true; e.preventDefault(); e.stopPropagation(); }
    else if (key === 'ArrowDown') { keys.down = true; e.preventDefault(); e.stopPropagation(); }
    else if (key === 'ArrowLeft') { keys.left = true; e.preventDefault(); e.stopPropagation(); }
    else if (key === 'ArrowRight') { keys.right = true; e.preventDefault(); e.stopPropagation(); }
    if (key === 'Escape' && isGameRunning3D) { exitGame(); e.preventDefault(); }
});

window.addEventListener('keyup', (e) => {
    const key = e.key;
    if (key === 'ArrowUp') { keys.up = false; e.preventDefault(); e.stopPropagation(); }
    else if (key === 'ArrowDown') { keys.down = false; e.preventDefault(); e.stopPropagation(); }
    else if (key === 'ArrowLeft') { keys.left = false; e.preventDefault(); e.stopPropagation(); }
    else if (key === 'ArrowRight') { keys.right = false; e.preventDefault(); e.stopPropagation(); }
});

// ============================================================
//  ⭐ СЕНСОРНОЕ УПРАВЛЕНИЕ
// ============================================================
const joystickArea = document.getElementById('joystickArea');
const joystickKnob = document.getElementById('joystickKnob');
const shootBtn = document.getElementById('shootButton');
let joystickActive = false;

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
if (isMobile) { 
    document.getElementById('touchControls').classList.add('show'); 
    document.getElementById('touchHint').classList.add('show'); 
}

function handleJoystickStart(e) { e.preventDefault(); joystickActive = true; handleJoystickMove(e); }
function handleJoystickMove(e) {
    e.preventDefault(); if (!joystickActive) return;
    const touch = e.touches ? e.touches[0] : e;
    const rect = joystickArea.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    let dx = (touch.clientX - centerX) / (rect.width / 2);
    let dy = (touch.clientY - centerY) / (rect.height / 2);
    const maxRadius = 1;
    const dist = Math.hypot(dx, dy);
    if (dist > maxRadius) { dx = dx / dist * maxRadius; dy = dy / dist * maxRadius; }
    const knobX = dx * 35; const knobY = dy * 35;
    joystickKnob.style.transform = `translate(calc(-50% + ${knobX}px), calc(-50% + ${knobY}px))`;
    keys.up = dy < -0.2; keys.down = dy > 0.2; keys.left = dx < -0.2; keys.right = dx > 0.2;
}
function handleJoystickEnd(e) { e.preventDefault(); joystickActive = false; joystickKnob.style.transform = 'translate(-50%, -50%)'; keys.up = false; keys.down = false; keys.left = false; keys.right = false; }

joystickArea.addEventListener('touchstart', handleJoystickStart, { passive: false });
joystickArea.addEventListener('touchmove', handleJoystickMove, { passive: false });
joystickArea.addEventListener('touchend', handleJoystickEnd, { passive: false });
joystickArea.addEventListener('touchcancel', handleJoystickEnd, { passive: false });
joystickArea.addEventListener('mousedown', (e) => { e.preventDefault(); joystickActive = true; handleJoystickMove(e); });
window.addEventListener('mousemove', (e) => { if (joystickActive) handleJoystickMove(e); });
window.addEventListener('mouseup', (e) => { if (joystickActive) handleJoystickEnd(e); });

shootBtn.addEventListener('touchstart', (e) => { e.preventDefault(); if (isGameRunning3D && !gameState?.isOver) shootBullet3D(); });
shootBtn.addEventListener('mousedown', (e) => { e.preventDefault(); if (isGameRunning3D && !gameState?.isOver) shootBullet3D(); });

// ============================================================
//  ⭐ ИНИЦИАЛИЗАЦИЯ
// ============================================================
function init() {
    console.log('🚀 Инициализация игры...');
    
    // Загрузка прогресса
    const loaded = loadProgress();
    
    if (!loaded) {
        console.log('🆕 Создаём новый профиль');
        playerData.coins = 0;
        playerData.powerPoints = 0;
        playerData.chests = 0;
        playerData.ownedBrawlers = ['shelly'];
        playerData.selectedBrawler = 'shelly';
        playerData.brawlerLevels = {};
        playerData.brawlerStarPowers = {};
        playerData.brawlerHypercharge = {};
        forceSave();
    }
    
    // Инициализация бойцов
    initBrawlers();
    
    // Обновление статистики бойцов
    ALL_BRAWLERS.forEach((b) => {
        const level = playerData.brawlerLevels[b.id] || 1;
        const hpMultiplier = 1 + (level - 1) * HP_PER_LEVEL;
        const speedMultiplier = 1 + (level - 1) * SPEED_PER_LEVEL;
        
        if (playerData.brawlerStats[b.id]) {
            playerData.brawlerStats[b.id].hp = Math.floor(b.baseHp * hpMultiplier);
            playerData.brawlerStats[b.id].speed = Math.round((b.baseSpeed * speedMultiplier) * 1000) / 1000;
            playerData.brawlerStats[b.id].level = level;
            playerData.brawlerStats[b.id].unlocked = playerData.ownedBrawlers.includes(b.id);
        }
    });
    
    // Обновление UI
    updateUI();
    
    // Инициализация вкладок
    initTabs();
    
    // Настройка кнопок
    document.getElementById('playMatchBtn').addEventListener('click', startGame);
    document.getElementById('defeatRetryBtn').addEventListener('click', () => { 
        document.getElementById('defeatOverlay').style.display = 'none'; 
        startGame(); 
    });
    document.getElementById('defeatMenuBtn').addEventListener('click', exitGame);
    document.getElementById('winRetryBtn').addEventListener('click', () => { 
        document.getElementById('winOverlay').style.display = 'none'; 
        startGame(); 
    });
    document.getElementById('winMenuBtn').addEventListener('click', exitGame);
    
    // Магазин
    document.querySelectorAll('[data-shop]').forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.shop;
            if (type === 'chest' && playerData.coins >= 100) {
                playerData.coins -= 100;
                playerData.chests += 1;
                forceSave();
                showSaveStatus(`🎁 Куплен ящик! Осталось ${playerData.coins}🪙`);
                updateUI();
            } else {
                alert('Недостаточно монет! Нужно 100 🪙');
            }
        });
    });
    
    // Ящик
    document.querySelector('#chestOpenBtn .open-btn').addEventListener('click', openChest);
    document.getElementById('chestCloseBtn').addEventListener('click', () => { 
        document.getElementById('chestOpenOverlay').classList.remove('show'); 
    });
    
    // Режимы
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedMode = btn.dataset.mode;
            document.getElementById('modeDesc').textContent = selectedMode === 'showdown' 
                ? '🏆 Королевская битва — убей всех врагов и стань чемпионом!' 
                : '⚔️ Дуэль 1v1 — сразись с боссом в одиночном бою!';
        });
    });
    
    // Автосохранение
    setInterval(() => { forceSave(); }, 15000);
    
    // Сохранение перед выходом
    window.addEventListener('beforeunload', () => { forceSave(); });
    
    console.log('✅ Игра успешно загружена!');
    console.log(`💰 Монет: ${playerData.coins}`);
    console.log(`⭐ Очков силы: ${playerData.powerPoints}`);
    console.log(`🎁 Ящиков: ${playerData.chests}`);
    console.log(`👥 Бойцов: ${playerData.ownedBrawlers.join(', ')}`);
    
    document.getElementById('gameCanvas').focus();
    window.focus();
}

// Запуск
init();