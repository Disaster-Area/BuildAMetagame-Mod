exports.BattleAbilities = {
//the file where an ability's functionality is stored
"enchantedivy": {
	desc: "This Pokemon's Special Attack stat is 1.4x stronger. Therefore, if their Special Attack on the status screen is 100, it effectively has a Special Attack stat of 140; which is then subject to the full range of Special Attack boosts and drops.",
	shortDesc: "This Pokemon's Special Attack is 1.4x stronger.",
	onModifySpaPriority: 5,
	onModifySpa: function (spa, pokemon) {
		this.debug("Enchanted Ivy boost");
		return this.chainModify(1.4);
	},
	id: "enchantedivy",
	name: "Enchanted Ivy",
	isNonstandard: true,
	rating: 4.5,
	num: -1001
},
"plantingroots": {
                desc: "The Pokemon makes extendable roots to plant into the ground, allowing it to get 1/16 of it's max HP back at the end of each turn.",
                shortDesc: "The Pokemon restores 1/16 of it's max HP at the end of each turn.",
                id: "plantingroots",
                name: "Planting Roots",
                onResidualOrder: 5,
                onResidualSubOrder: 2,
                onResidual: function (pokemon) {
                        this.heal(pokemon.maxhp / 16);
                },     
                rating: 4,
                num: -1003
        },
"resolve": {
		shortDesc: "This Pokemon's moves and their effects ignore the Abilities of other Pokemon.",
		onStart: function (pokemon) {
			this.add('-ability', pokemon, 'Resolve');
		},
		onAllyModifyPokemonPriority: 100,
		onAllyModifyPokemon: function (pokemon) {
			if (this.activePokemon === this.effectData.target && pokemon !== this.activePokemon) {
				pokemon.ignore['Ability'] = 'A';
			}
		},
		onFoeModifyPokemonPriority: 100,
		onFoeModifyPokemon: function (pokemon) {
			if (this.activePokemon === this.effectData.target) {
				pokemon.ignore['Ability'] = 'A';
			}
		},
		id: "resolve",
		name: "Resolve",
		rating: 3.5,
		num: -1024
	},
"paineater": {
	desc: "This pokemon is healed for 1/4 of the enemy's health that has been lost.",
	shortDesc: "Pokemon restores 1/4 of damage dealt to the opponent.",
	onResidualOrder: 26,
	onResidualSubOrder: 1,
	onResidual: function (pokemon) {
		if (!pokemon.hp) return;
		for (var i = 0; i < pokemon.side.foe.active.length; i++) {
			var target = pokemon.side.foe.active[i];
			if (!target || !target.hp) continue;
			this.heal(target.damage / 4, target);
		}		
	},
	id: "paineater",
	name: "Pain Eater",
	isNonstandard: true,
	rating: 5,
	num: -1014
},
"specialist": {
	desc: "STAB moves move first in this Pokemon's priority bracket. If the move doesn't have STAB, the Pokemon moves last in their priority bracket. This ability doesn't affect status moves.",
	shortDesc: "Pokemon's STAB moves have +1 priority. Doesn't effect status inflictions.",
	onModifyPriority: function (priority, pokemon, target, move) {
		if (move && move.type === pokemon.type) {
			return priority + 1;
		} else if (move && move.type !== pokemon.type) {
			return priority - 1;
		}
	},
	id: "specialist",
	name: "Specialist",
	isNonstandard: true,
	rating: 4.5,
	num: -1015
},
"quickblows": {
	desc: "Moves with 60 base power or less move first in the user's priority bracket. This does not affect status inflictions or moves with a base priority other than 0.",
	shortDesc: "Moves with 60 base power or less have +1 priority. Doesn't affect status.",
	onBasePowerPriority: 9,
	onBasePower: function (basePower, pokemon, target, priority, move) {
		if (basePower <= 60) return priority + 1;
	},
	id: "quickblows",
	name: "Quick Blows",
	isNonstandard: true,
	rating: 3.5,
	num: -1016
},
"overdrive": {
	desc: "When the Pokemon's HP is at 50% or below, their speed stat is doubled.",
	shortDesc: "When the HP is 50% or lower, the speed stat is doubled.",
	onModifySpePriority: 5,
	onModifySpe: function (spe, pokemon) {
		if (pokemon.hp < pokemon.maxhp / 2) {
			return this.chainModify(2);
		}
	},
	onResidual: function (pokemon) {
		pokemon.update();
	},
	id: "overdrive",
	name: "Overdrive",
	isNonstandard: true,
	rating: 4,
	num: -1024
},
"toughscales": {
	desc: "Causes recoil damage equal to 1/8 of the opponent's max HP if an opponent makes contact.",
	shortDesc: "This Pokemon causes other Pokemon making contact to lose 1/8 of their max HP.",
	onAfterDamageOrder: 1,
	onAfterDamage: function (damage, target, source, move) {
		if (source && source !== target && move && move.isContact) {
			this.damage(source.maxhp / 8, source, target, null, true);
		}
	},
	id: "toughscales",
	name: "Tough Scales",
	rating: 3,
	num: -1025
},
"relentless": {
	desc: "Opponents cannot reduce this Pokemon's Attack, Special Attack, and Speed stats; they can, however, modify stat changes with Power Swap, Guard Swap and Heart Swap and inflict stat boosts with Swagger and Flatter. This ability does not prevent self-inflicted stat reductions.",
	shortDesc: "Prevents other Pokemon from lowering this Pokemon's stat stages.",
	onBoost: function (boost, target, source, effect) {
		if (source && target === source) return;
		var showMsg = false;
		for (var i in boost) {
			if (boost[i] < 0 && boost[i] = 'atk' || boost[i] < 0 && boost[i] = 'spa' || boost[i] < 0 && boost[i] = 'spe') {
				delete boost[i];
				showMsg = true;
		}
		if (showMsg && !effect.secondaries) this.add("-fail", target, "unboost", "[from] ability: Relentless", "[of] " + target);
	},
	id: "relentless",
	name: "Relentless",
	isNonstandard: true,
	rating: 2,
	num: -1026
},
"fireproof": {
	desc: "This Pokemon cannot be burned and is not affected by Fire-type moves.",
	shortDesc: "This Pokemon cannot become burned. Isn't affected by Fire moves.",
	onUpdate: function (pokemon) {
		if (pokemon.status === 'brn') {
			pokemon.cureStatus();
		}
	},
	onImmunity: function (type, pokemon) {
		if (type === 'brn') return false;
	},
	onTryHit: function (target, source, move) {
		if (target !== source && move.type === 'Fire') {
			move.accuracy = true;
			if (!target.addVolatile('fireproof')) {
				this.add('-immune', target, '[msg]');
			}
			return null;
		}
	},
	id: "fireproof",
	name: "Fire Proof",
	isNonstandard: true,
	rating: 4,
	num: -1027
},
"freezingpoint": {
	desc: "Turns all of this Pokemon's Water-typed attacks into Ice-typed and have a 10% chance to lower the target's speed by one stage, while also raising the damage 1.3x. Does not affect Hidden Power.",
	shortDesc: "This Pokemon's Normal moves become Ice-type and have a 10% chance to lower the opponent's speed 1 stage. 1.3x boost.",
	onModifyMove: function (move, pokemon) {
		if (move.type === 'Water' && move.id !== 'hiddenpower') {
			move.type = 'Ice';
			pokemon.addVolatile('freezingpoint');
		}
	},
	onAfterDamage: function (damage, target, source, move) {
		if (this.random(10) < 1) {
			this.boost({spe: -1}, source, target);
		}
	}
	effect: {
		duration: 1,
		onBasePowerPriority: 8,
		onBasePower: function (basePower, pokemon, target, move) {
			return this.chainModify([0x14CD, 0x1000]);
		}
	},
	id: "freezingpoint",
	name: "Freezing Point",
	isNonstandard: true,
	rating: 3,
	num: -1028
},
"boilingpoint": {
	desc: "All Water-typed moves used by this Pokemon will have a 20% chance to burn. Does not include Hidden Power.",
	shortDesc: "Water moves have a 20% chance to burn. Does not include Hidden Power.",
	onAfterDamage: function (damage, target, source, move) {
		if (move.type === 'Water' && move.id !== 'hiddenpower') {
			if (this.random(10) < 2) {
				source.trySetStatus('brn', target, move);
			}
			this.addVolatile('boilingpoint');
		}
	},
	id: "boilingpoint",
	name: "Boiling Point",
	isNonstandard: true,
	rating: 3.5,
	num: -1029
},
"strongtail": {
	desc: "This Pokemon receives a 30% power boost for tail attacks such as Tail Slam. This ability also affects Slam.",
	shortDesc: "This Pokemon's tail-based attacks do 1.3x damage. Slam included.",
	onBasePowerPriority: 8,
	onBasePower: function (basePower, attacker, defender, move) {
		if (move && (move.id === 'aquatail' || move.id === 'aquatail' || move.id === 'dragontail' || move.id === 'poisontail' || move.id === 'tailslap' || move.id === 'tailslam' || move.id === 'slam')) {
			this.debug("Strong Tail boost");
			return this.chainModify(1.3);
		}
	},
	id: "strongtail",
	name: "Strong Tail",
	isNonstandard: true,
	rating: 3,
	num: -1030
},
"upgraded": {
	desc: "Normal-type moves get STAB boosted. On Normal-types, STAB boost becomes 0.5x.",
	shortDesc: "Normal moves get STAB boost. Normal-type STAB is 0.5x.",
	onModifyMove: function (move, pokemon) {
		if (move && move.type === 'Normal') {
			if(pokemon && pokemon.type === 'Normal') {
				this.debug("Upgraded weaken");
				return this.chainModify(0.5);
			}
			this.debug("Upgraded boost");
			return this.chainModify(1.5);
		}
	},
	id: "upgraded",
	name: "Upgraded",
	isNonstandard: true,
	rating: 4,
	num: -1031
},
"sharpeye": {
	desc: "The accuracy of this Pokemon's moves receives a 30% increase; for example, a 75% accurate move becomes 97.5% accurate.",
	shortDesc: "This Pokemon's moves have their accuracy boosted to 1.3x.",
	onSourceAccuracy: function (accuracy) {
		if (typeof accuracy !== 'number') return;
		this.debug('sharpeye - enhancing accuracy');
		return accuracy * 1.3;
	},
	id: "sharpeye",
	name: "Sharp Eye",
	isNonstandard: true,
	rating: 3.5,
	num: -1032
},
"mysticveil": {
	desc: "Super-effective attacks only deal 3/4 their usual damage against this Pokemon.",
	shortDesc: "This Pokemon receives 3/4 damage from super effective attacks.",
	onSourceModifyDamage: function (damage, source, target, move) {
		if (target.runEffectiveness(move) > 0) {
			this.debug('Mystic Veil neutralize');
			return this.chainModify(0.75);
		}
	},
	id: "mysticveil",
	name: "Mystic Veil",
	isNonstandard: true,
	rating: 3,
	num: -1033
},
"sharpshooter": {
	desc: "Attacks with a base power of 50 or less have higher results in a critical hit.",
	shortDesc: "Moves with 50BP or lower almost always land a critical hit.",
	onModifyMove: function (basePower, move) {
		if (basePower <= 50) {
			this.debug('Sharp Shooter boost');
			move.critRatio === 10;
		}
	},
	id: "sharpshooter",
	name: "Sharp Shooter",
	isNonstandard: true,
	rating: 3.5,
	num: -1034
},
"juggernaut": {
	desc: "If this Pokemon knocks out another Pokemon with a damaging attack, its Attack is raised by one stage.",
	shortDesc: "This Pokemon's Attack is boosted by 1 if it attacks and faints another Pokemon.",
	onSourceFaint: function (target, source, effect) {
		if (effect && effect.effectType === 'Move') {
			this.boost({atk:1}, source);
		}
	},
	id: "juggernaut",
	name: "Juggernaut",
	isNonstandard: true,
	rating: 4,
	num: -1039
},
"immunedefense": {
	desc: "Every time this Pokemon gets inflicted with a status, one random stat gets risen by two stages.",
	shortDesc: "Whenever this Pokemon gets statused, a random stat gets a +2 boost. Stat being risen depends on the status inflicted.",
	onModifyAtkPriority: 5,
	onModifyAtk: function (atk, pokemon) {
		if (pokemon.status === 'brn') {
			this.debug("Immune Defense boost");
			return this.chainModify(2);
		}
	},
	onModifySpaPriority: 5,
	onModifySpa: function (spa, pokemon) {
		if (pokemon.status === 'psn') {
			this.debug("Immune Defense boost");
			return this.chainModify(2);
		}
	},
	onModifyDefPriority: 5,
	onModifyDef: function (def, pokemon) {
		if (pokemon.status === 'tox') {
			this.debug("Immune Defense boost");
			return this.chainModify(2);
		}
	},
	onModifySpdPriority: 5,
	onModifySpd: function (spd, pokemon) {
		if (pokemon.status === 'tox') {
			this.debug("Immune Defense boost");
			return this.chainModify(2);
		}
	},
	onModifySpePriority: 5,
	onModifySpe: function (spe, pokemon) {
		if (pokemon.status === 'par') {
			this.debug("Immune Defense boost");
			return this.chainModify(2);
		}
	},
	onModifyAccPriority: 5,
	onModifyAcc: function (acc, pokemon) {
		if (pokemon.status === 'slp') {
			this.debug("Immune Defense boost");
			return this.chainModify(2);
		}
	},
	id: "immunedefense",
	name: "immunedefense",
	isNonstandard: true,
	rating: 3,
	num: -1040
},
"feedback": {
	desc: "When another Pokemon uses Absorb, Drain Punch, Dream Eater, Giga Drain, Leech Life, Leech Seed or Mega Drain against this Pokemon, the attacking Pokemon loses the amount of health that it would have gained.",
	shortDesc: "This Pokemon damages those draining HP from it for as much as they would heal.",
	id: "feedback",
	onSourceTryHeal: function (damage, target, source, effect) {
		this.debug("Heal is occurring: " + target + " <- " + source + " :: " + effect.id);
		var canOoze = {drain: 1, leechseed: 1};
		if (canOoze[effect.id]) {
			this.damage(damage, null, null, null, true);
			return 0;
		}
	},
	onTryHit: function (target, source, move) {
		if (target !== source && move.type === 'Electric') {
			return this.damage(source.maxhp / 8, source, target, null, true);
		}
	},
	name: "Feedback",
	isNonstandard: true,
	rating: 1,
	num: -1041
},
"ghoulify": {
	desc: "Turns all of this Pokemon's Normal-typed attacks into Ghost-type and deal 1.3x damage. Does not affect Hidden Power.",
	shortDesc: "This Pokemon's Normal moves become Ghost-type and do 1.3x damage.",
	onModifyMove: function (move, pokemon) {
		if (move.type === 'Normal' && move.id !== 'hiddenpower') {
			move.type = 'Ghost';
			pokemon.addVolatile('ghoulify');
		}
	},
	effect: {
		duration: 1,
		onBasePowerPriority: 8,
		onBasePower: function (basePower, pokemon, target, move) {
			return this.chainModify([0x14CD, 0x1000]);
		}
	},
	id: "ghoulify",
	name: "Ghoulify",
	isNonstandard: true,
	rating: 3,
	num: -1042
},
"superslams": {
	desc: "Any Pokemon with this ability have all Slam-based moves, or moves with Slam in them, 30% more powerful.",
	shortDesc: "Pokemon with this ability have their Slam-based moves 1.3x stronger.",
	onBasePowerPriority: 8,
	onBasePower: function (basePower, defender, attacker, move) {
		if(move && (move.id === 'tailslam' || move.id === 'slam' || move.id === 'bodyslam' || move.id === 'metalslam' || move.id === 'rocketslam' || move.id === 'dragonslam' || move.id === 'hornslam')) {
			this.debug("Super Slams boost");
			return this.chainModify(1.3);
		}
	},
	id: "superslams",
	name: "Super Slams",
	isNonstandard: true,
	rating: 3.5
	num: -1043
},
"oversight": {
		shortDesc: "This Pokemon's Special Defense is halfed.",
		onModifySpDPriority: 5,
		onModifySpD: function (spd) {
			return this.chainModify(0.5);
		},
		id: "oversight",
		name: "Oversight",
		rating: 1,
		num: -1044
	},
	"sleepingstrength": {
		shortDesc: "If asleep the user's atk is multiplied by 30%",
		id: "sleepingstrength",
		name: "Sleeping Strength",
		onModifyAtkPriority: 5,
		onModifyAtk: function (atk) {
			return this.chainModify(1.3);
		},
		rating: 2.5,
		num: -1045
	}
};
