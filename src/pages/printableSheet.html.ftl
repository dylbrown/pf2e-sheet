[#ftl]
<!doctype html>
<html lang="en-US">
<head>
    <style>
        [#include "printableStyle.css"]
    </style>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <title>PF2 - ${character.qualities.name}</title>
</head>
<body>
<div class="page">
    <div class="printBorder"></div>
    <div id="leftThird">
        <div class="column" style="justify-content: stretch">
            <div>PATHFINDER CHARACTER SHEET</div>
            <div class="sectionDivider">
                <hr>
            </div>
            <div class="sectionLabel" style="text-transform: uppercase">Ability Scores</div>
            <div id="ability-grid">
                <div class="line">
                    <div class="inverted numBox rounded" style="font-weight: bold">STR</div>
                    <div class="label invisible">A</div>
                </div>
                <div class="line">
                    <div class="underlined-roll">${character.abilityMod.str?string.@s}</div>
                    <div class="label">Mod</div>
                </div>
                <div class="line">
                    <div class="numBox rounded">${character.abilityScore.str}</div>
                    <div class="label">Score</div>
                </div>
                <div class="line">
                    <div class="inverted numBox rounded" style="font-weight: bold">INT</div>
                    <div class="label invisible">A</div>
                </div>
                <div class="line">
                    <div class="underlined-roll">${character.abilityMod.int?string.@s}</div>
                    <div class="label">Mod</div>
                </div>
                <div class="line">
                    <div class="numBox rounded">${character.abilityScore.int}</div>
                    <div class="label">Score</div>
                </div>
                <div class="line">
                    <div class="inverted numBox rounded" style="font-weight: bold">DEX</div>
                    <div class="label invisible">A</div>
                </div>
                <div class="line">
                    <div class="underlined-roll">${character.abilityMod.dex?string.@s}</div>
                    <div class="label">Mod</div>
                </div>
                <div class="line">
                    <div class="numBox rounded">${character.abilityScore.dex}</div>
                    <div class="label">Score</div>
                </div>
                <div class="line">
                    <div class="inverted numBox rounded" style="font-weight: bold">WIS</div>
                    <div class="label invisible">A</div>
                </div>
                <div class="line">
                    <div class="underlined-roll">${character.abilityMod.wis?string.@s}</div>
                    <div class="label">Mod</div>
                </div>
                <div class="line">
                    <div class="numBox rounded">${character.abilityScore.wis}</div>
                    <div class="label">Score</div>
                </div>
                <div class="line">
                    <div class="inverted numBox rounded" style="font-weight: bold">CON</div>
                    <div class="label invisible">A</div>
                </div>
                <div class="line">
                    <div class="underlined-roll">${character.abilityMod.con?string.@s}</div>
                    <div class="label">Mod</div>
                </div>
                <div class="line">
                    <div class="numBox rounded">${character.abilityScore.con}</div>
                    <div class="label">Score</div>
                </div>
                <div class="line">
                    <div class="inverted numBox rounded" style="font-weight: bold">CHA</div>
                    <div class="label invisible">A</div>
                </div>
                <div class="line">
                    <div class="underlined-roll">${character.abilityMod.cha?string.@s}</div>
                    <div class="label">Mod</div>
                </div>
                <div class="line">
                    <div class="numBox rounded">${character.abilityScore.cha}</div>
                    <div class="label">Score</div>
                </div>
            </div>
            <div class="sectionDivider">
                <hr>
            </div>
            <div class="sectionLabel">Misc.</div>
            <div class="row-between">
                <div class="line">
                    <div class="numBox rounded">${character.speed} ft.</div>
                    <div class="label">Speed</div>
                </div>
                <div class="line">
                    <div class="numBox rounded">${(10 + character.attributes.get("classdc", character.pclass).total)?string}</div>
                    <div class="label">Class DC</div>
                </div>
                <div class="line" style="flex-grow: 0">
                    <div class="hero-grid">
                        <div class="hero-box"></div>
                        <div class="hero-box"></div>
                        <div class="hero-box"></div>
                    </div>
                    <div class="label">Hero Points</div>
                </div>
            </div>
            <div class="sectionDivider">
                <hr>
            </div>
            <div class="sectionLabel">Health</div>
            <div class="row-between" style="flex-grow: 2">
                <div class="line" style="flex-grow: 0">
                    <div class="numBox rounded">${character.hp}</div>
                    <div class="label">Max</div>
                </div>
                <div class="line">
                    <div class="numBox"></div>
                    <div class="label">Current</div>
                </div>
                <div class="line">
                    <div class="numBox"></div>
                    <div class="label">Conditions</div>
                </div>
            </div>
            <div class="sectionDivider">
                <hr>
            </div>
            <div class="sectionLabel">Armor Class</div>
            <div id="ac-grid">
                <div class="top-right rollLabel" style="height: 1.5em">AC</div>
                <div class="line">
                    <div class="underlined-roll">${character.combat.ac}</div>
                    <div class="label">Total</div>
                </div>
                <div class="line">
                    <div class="numBox rounded" style="border:none">10</div>
                    <div class="box-label">Base</div>
                </div>
                <div class="line">
                    <div class="numBox rounded">${character.abilityMod.dex?string.@s}</div>
                    <div class="box-label">DEX</div>
                </div>
                [@proficiencyDisplay proficiency=character.combat.armorProficiency grid=true /]
                <div class="line">
                    <div class="numBox">[#if character.combat.armor.ac != 0]${character.combat.armor.ac?string.@s}[/#if]</div>
                    <div class="box-label">Item</div>
                </div>
                <div class="line">
                    <div class="numBox dashed"></div>
                    <div class="box-label">Temp</div>
                </div>
                <div class="line">
                    <div class="numBox" style="border-radius: 40%">[#if character.combat.shield.ac != 0]${character.combat.shield.ac?string.@s}[/#if]</div>
                    <div class="box-label">Shield</div>
                </div>
            </div>
            <div class="sectionDivider">
                <hr>
            </div>
            <div class="sectionLabel">Perception + Saves</div>
            <div id="rolls-grid">
                <div class="center-right rollLabel">PERCEPTION</div>
                <div class="line">
                    <div class="underlined-roll">${character.attributes.perception.total?string.@s}</div>
                    <div class="label">Mod</div>
                </div>
                <div class="line">
                    <div class="numBox rounded">${character.abilityMod.wis?string.@s}</div>
                    <div class="label">WIS</div>
                </div>
                [@proficiencyDisplay proficiency=character.attributes.perception.proficiency grid=true /]
                <div class="line">
                    <div class="numBox">[#if character.attributes.perception.itemBonus != 0]${character.attributes.perception.itemBonus?string.@s}[/#if]</div>
                    <div class="label">Item</div>
                </div>
                <div class="line">
                    <div class="numBox dashed"></div>
                    <div class="label">Temp</div>
                </div>
                <div class="center-right rollLabel">FORTITUDE</div>
                <div class="line">
                    <div class="underlined-roll">${character.attributes.fortitude.total?string.@s}</div>
                    <div class="label">Mod</div>
                </div>
                <div class="line">
                    <div class="numBox rounded">${character.abilityMod.con?string.@s}</div>
                    <div class="label">CON</div>
                </div>
                [@proficiencyDisplay proficiency=character.attributes.fortitude.proficiency grid=true /]
                <div class="line">
                    <div class="numBox">[#if character.attributes.fortitude.itemBonus != 0]${character.attributes.fortitude.itemBonus?string.@s}[/#if]</div>
                    <div class="label">Item</div>
                </div>
                <div class="line">
                    <div class="numBox dashed"></div>
                    <div class="label">Temp</div>
                </div>
                <div class="center-right rollLabel">REFLEX</div>
                <div class="line">
                    <div class="underlined-roll">${character.attributes.reflex.total?string.@s}</div>
                    <div class="label">Mod</div>
                </div>
                <div class="line">
                    <div class="numBox rounded">${character.abilityMod.dex?string.@s}</div>
                    <div class="label">DEX</div>
                </div>
                [@proficiencyDisplay proficiency=character.attributes.reflex.proficiency grid=true /]
                <div class="line">
                    <div class="numBox">[#if character.attributes.reflex.itemBonus != 0]${character.attributes.reflex.itemBonus?string.@s}[/#if]</div>
                    <div class="label">Item</div>
                </div>
                <div class="line">
                    <div class="numBox dashed"></div>
                    <div class="label">Temp</div>
                </div>
                <div class="center-right rollLabel">WILL</div>
                <div class="line">
                    <div class="underlined-roll">${character.attributes.will.total?string.@s}</div>
                    <div class="label">Mod</div>
                </div>
                <div class="line">
                    <div class="numBox rounded">${character.abilityMod.wis?string.@s}</div>
                    <div class="label">WIS</div>
                </div>
                [@proficiencyDisplay proficiency=character.attributes.will.proficiency grid=true /]
                <div class="line">
                    <div class="numBox">[#if character.attributes.will.itemBonus != 0]${character.attributes.will.itemBonus?string.@s}[/#if]</div>
                    <div class="label">Item</div>
                </div>
                <div class="line">
                    <div class="numBox dashed"></div>
                    <div class="label">Temp</div>
                </div>
            </div>
            <div class="sectionDivider">
                <hr>
            </div>
            <div class="sectionLabel">Weapon & Armor Proficiencies</div>
            <div id="prof-grid">
                [@proficiencyDisplay proficiency=character.attributes.unarmed.proficiency grid=false /]
                [@proficiencyDisplay proficiency=character.attributes.simpleweapons.proficiency grid=false /]
                [@proficiencyDisplay proficiency=character.attributes.martialweapons.proficiency grid=false /]
                [@proficiencyDisplay proficiency=character.attributes.advancedweapons.proficiency grid=false /]
                <div class="label">Unarmed</div>
                <div class="label">Simple</div>
                <div class="label">Martial</div>
                <div class="label">Advanced</div>
                [@proficiencyDisplay proficiency=character.attributes.unarmored.proficiency grid=false /]
                [@proficiencyDisplay proficiency=character.attributes.lightarmor.proficiency grid=false /]
                [@proficiencyDisplay proficiency=character.attributes.mediumarmor.proficiency grid=false /]
                [@proficiencyDisplay proficiency=character.attributes.heavyarmor.proficiency grid=false /]
                <div class="label">Unarmored</div>
                <div class="label">Light</div>
                <div class="label">Medium</div>
                <div class="label">Heavy</div>
            </div>
        </div>
    </div>
    <div id="middleThird">
        <div class="column" style="justify-content: flex-start">
            <div class="sectionDivider">
                <hr>
            </div>
            <div class="sectionLabel">Character Info</div>
            <div id="info-grid">
                <div class="line" style="grid-row-end: span 2; grid-column-end: span 2">
                    <div class="underlined wrap">${character.qualities.name}</div>
                    <div class="label">Character Name</div>
                </div>
                <div class="line" style="grid-column-end: span 2; min-height: 2em">
                    <div class="underlined">
                    ${character.heritage} [#if !character.heritage?ends_with(character.ancestry)]${character.ancestry}[/#if]
                    </div>
                    <div class="label">Ancestry & Heritage</div>
                </div>
                <div class="line" style="grid-column-end: span 2">
                    <div class="underlined">${character.background}</div>
                    <div class="label">Background</div>
                </div>
                <div class="line" style="grid-column-end: span 2">
                    <div class="underlined">${character.qualities.player}</div>
                    <div class="label">Player</div>
                </div>
                <div class="line">
                    <div class="underlined">${character.pclass}</div>
                    <div class="label">Class</div>
                </div>
                <div class="line">
                    <div class="underlined">${character.deity}</div>
                    <div class="label">Deity</div>
                </div>
                <div class="line">
                    <div class="underlined">${character.alignment}</div>
                    <div class="label">Alignment</div>
                </div>
                <div class="line">
                    <div class="underlined">${character.ancestry.size}</div>
                    <div class="label">Size</div>
                </div>
                <div class="line" style="grid-column-end: span 2">
                    <div class="underlined">
                        [#list character.qualities.traits as trait]
                            ${trait}[#sep], [/#sep]
                        [#else]None[/#list]
                    </div>
                    <div class="label">Traits</div>
                </div>
                <div class="line" style="grid-column-end: span 2">
                    <div class="underlined">
                        [#list character.qualities.languages as language]
                            ${language}[#sep], [/#sep]
                        [#else]None[/#list]
                    </div>
                    <div class="label">Languages</div>
                </div>
                <div class="line" style="grid-column-end: span 2">
                    <div class="underlined">
                        [#list character.qualities.senses as sense]
                        ${sense}[#sep], [/#sep]
                        [#else]None[/#list]
                    </div>
                    <div class="label">Senses</div>
                </div>
            </div>
[#macro weaponBlock weapon type]
    <div class="row-stretch weapon" style="flex-grow:0">
        <div class="weapon-label">${weapon.name}</div>
        <div class="column">
            <div class="row-stretch">
                <div class="line" style="flex-grow: .5">
                    <div class="underlined weapon-info">${weapon.attack?string.@s}</div>
                    <div class="label">Attack</div>
                </div>
                <div class="line">
                    <div class="underlined weapon-info">
                        [#list weapon.damage.asList() as damage]
                            ${damage}[#sep]<br> + [/#sep]
                        [/#list]
                    </div>
                    <div class="label">Damage</div>
                </div>
                <div class="line" style="flex-grow: .5">
                    <div class="underlined weapon-info">
                        ${weapon.hands}
                    </div>
                    <div class="label">Hands</div>
                </div>
                [#if type == "ranged"]
                    <div class="line">
                        <div class="underlined weapon-info">${weapon.range} ft.</div>
                        <div class="label">Range</div>
                    </div>
                [/#if]
                <div class="line">
                    <div class="underlined weapon-traits">
                        [#list weapon.traits as trait]
                            ${trait}[#sep], [/#sep]
                        [/#list]
                    </div>
                    <div class="label">Traits</div>
                </div>
            </div>
        </div>
    </div>
[/#macro]
            [#assign melee = character.combat.attacks?size > 0]
            [#assign ranged = character.combat.attacks?size > 0]
            [#list character.inventory as item]
                [#if item.category == "Weapons"]
                    [#assign melee = true]
                [#elseif item.category == "Ranged Weapons"]
                    [#assign ranged = true]
                [/#if]
                [#if melee == true && ranged == true]
                    [#break]
                [/#if]
            [/#list]
            [#if melee]
            <div class="sectionDivider">
                <hr>
            </div>
            <div class="sectionLabel">Melee Strikes</div>
            [/#if]
            [#list character.combat.attacks as attack]
                [@weaponBlock weapon=attack.item type="melee"/]
            [/#list]
            [#list character.inventory as item]
                [#if item.category == "Weapons"]
                    [@weaponBlock weapon=item type="melee"/]
                [/#if]
            [/#list]
            [#if ranged]
            <div class="sectionDivider">
                <hr>
            </div>
            <div class="sectionLabel">Ranged Strikes</div>
            [/#if]
            [#list character.combat.attacks as attack]
                [#if attack.item.category == "Ranged Weapons"]
                    [@weaponBlock weapon=attack.item type="ranged"/]
                [/#if]
            [/#list]
            [#list character.inventory as item]
                [#if item.category == "Ranged Weapons"]
                    [@weaponBlock weapon=item type="ranged"/]
                [/#if]
            [/#list]
            [#if character.abilities?size > 0]
            <div class="sectionDivider">
                <hr>
            </div>
            <div class="sectionLabel">Actions and Activities</div>
            [/#if]
[#macro actionBlock action]
[#assign reaction=false]
<div class="row-stretch action" style="flex-grow: 0">
    <div class="action-icon">[#switch action.getExtensionByName("Activity").cost]
        [#case "Free"]F[#break]
        [#case "Reaction"]R[#assign reaction=true][#break]
        [#case "One"]1[#break]
        [#case "Two"]2[#break]
        [#case "Three"]3[#break]
        [/#switch]</div>
    <div class="action-label">${action.name}</div>
    <div class="column-wrap action-details">
        [#if action.traits?has_content]
        <div class="line">
            <div class="underlined">[#list action.traits as trait]${trait}[#sep], [/#sep][/#list]</div>
            <div class="label">Traits</div>
        </div>
        [/#if]
        [#if reaction]
        <div class="line">
            <div class="underlined">${action.getExtensionByName("Activity").trigger}</div>
            <div class="label">Trigger</div>
        </div>
        [/#if]
        [#if action.getExtensionByName("Activity").frequency?has_content]
        <div class="line">
            <div class="underlined">${action.getExtensionByName("Activity").frequency}</div>
            <div class="label">Frequency</div>
        </div>
        [/#if]
        [#if action.requirements?has_content]
        <div class="line">
            <div class="underlined">${action.requirements}</div>
            <div class="label">Requirements</div>
        </div>
        [/#if]
    </div>
</div>
[/#macro]
            <div class="column" style="flex-grow: 0">
                [#assign notFirst=false]
                [#list character.abilities as ability]
                    [#if ability.hasExtension("Activity")]
                        [#if notFirst]
                            <div class="action-divider"></div>
                        [/#if]
                        [@actionBlock action=ability /]
                        [#assign notFirst=true]
                    [/#if]
                [/#list]
            </div>
            [#if character.spells.focusPointCount > 0]
            <div id="focus">
                <div class="line">
                    <div class="numBox rounded"></div>
                    <div class="label">Focus</div>
                </div>
                <div class="line">
                    <div class="numBox rounded">${character.spells.focusPointCount}</div>
                    <div class="label">Max Focus</div>
                </div>
            </div>
            [/#if]
        </div>
    </div>
    <div id="rightThird">
        <div class="column" style="justify-content: stretch">
            <div class="sectionDivider">
                <hr>
            </div>
            <div class="sectionLabel">Skills</div>
            <div id="skills-grid">
                <div class="label">Skill</div>
                <div class="label">Total</div>
                <div class="label">Stat</div>
                <div class="label">Prof</div>
                <div class="label">Item</div>
                [#list character.skills as skill]
                    <div class="skill-label">${skill.name}</div>
                    <div class="line">
                        <div class="underlined-roll">${skill.total?string.@s}</div>
                    </div>
                    <div style="align-self: center; text-transform: uppercase">${skill.ability}</div>
                    [@proficiencyDisplay proficiency=skill.proficiency grid=false /]
                    <div class="line">
                        <div class="numBox">[#if skill.itemBonus != 0]${skill.itemBonus?string.@s}[/#if]</div>
                    </div>
                [/#list]
            </div>
        </div>
    </div>
</div>
[#macro linePart label content=""]
    [#if content?has_content]
        <div class="line">
            <div class="underlined" style="flex-direction: row">
                ${content}
            </div>
            <div class="label">${label}</div>
        </div>
    [/#if]
[/#macro]
[#macro abilityBox ability]
<div class="ability-box">
    [#if ability.hasExtension("Activity")]<div class="action-icon">
        [#switch ability.getExtensionByName("Activity").cost]
            [#case "Free"]F[#break]
            [#case "Reaction"]R[#assign reaction=true][#break]
            [#case "One"]1[#break]
            [#case "Two"]2[#break]
            [#case "Three"]3[#break]
        [/#switch]
    </div>[/#if]
    <div class="ability-title">
        ${ability.name}
    </div>
    [@linePart label="Source" content=ability.source /]
    [@linePart label="Traits" content=ability.traits?join(", ") /]
    [@linePart label="Requirements" content=ability.requirements /]
    [#if ability.hasExtension("Activity")]
    [@linePart label="Trigger" content=ability.getExtensionByName("Activity").trigger /]
    [/#if]
    <div class="ability-description">${ability.description}</div>
</div>
[/#macro]
<div class="page">
    <div class="printBorder"></div>
    <div class="abilities-flex first-page">
        <div class="ability-box ability-section do-not-break">Class Feats</div>
        [#list character.abilities as ability]
            [#if ability.type == "Class" || ability.type == "ClassFeature"]
            [@abilityBox ability=ability /]
            [/#if]
        [/#list]
        <div class="ability-box ability-section do-not-break">General & Skill Feats</div>
        [#list character.abilities as ability]
            [#if ability.type != "Class" && ability.type != "Ancestry"]
            [@abilityBox ability=ability /]
            [/#if]
        [/#list]
        <div class="ability-box ability-section do-not-break">Ancestry Feats</div>
        [#list character.abilities as ability]
            [#if ability.type == "Ancestry"]
            [@abilityBox ability=ability /]
            [/#if]
        [/#list]
        <div id="inventory-grid">
            <div class="inventory-title col-section-title">Inventory</div>
            <div class="col-section-label">#</div>
            <div class="col-section-label">
                Item Name
            </div>
            <div class="col-section-label">Wt.</div>
            [#list character.inventory as item]
                <div>${item.count}</div>
                <div>${item.stats.name}</div>
                <div>${item.stats.prettyWeight}</div>
            [/#list]
        </div>
        [#list character.spells.spellLists as listName, spellList]
            [#if spellList.casterType == "Prepared"]
                <div id="spells-prepared">
                    <div class="spells-title col-section-title">${listName} Spells</div>
                    <div class="spells-stats">
                        <div class="rollLabel">Spell Attack</div>
                        <div class="numBox rounded">${character.attributes.get(spellList.spellAttacksAttribute?lower_case, listName).total?string.@s}</div>
                        <div class="rollLabel">Spell DC</div>
                        <div class="numBox rounded">${(10 + character.attributes.get(spellList.spellDCsAttribute?lower_case, listName).total)?string}</div>
                    </div>
                    <div class="col-section-label" style="border-left: 1px solid black">Spell Name</div>
                    <div class="col-section-label col-center" style="border-right: 1px solid black">Slots</div>
                    [#list spellList.spellsKnown?reverse as levelSpells]
                        [#if levelSpells?size > 0]
                                [#assign level=spellList.spellsKnown?size-levelSpells?index-1]
                            <div class="spells-level">
                                <div class="spells-line fixed"></div>
                                <div class="spells-level-label">
                                    [#if level == 0]
                                        Cantrips
                                    [#else]
                                        Level ${level}
                                    [/#if]
                                </div>
                                <div class="spells-line"></div>
                            </div>
                            <div class="spells-level">
                                <div class="spells-line"></div>
                                <div class="spells-level-label">${spellList.spellSlots[level]}</div>
                                <div class="spells-line"></div>
                            </div>
                            [#list levelSpells as spell]
                                <div class="spells-name">${spell.name}</div>
                                <div class="spells-slot-container">
                                    [#if level == 0]
                                        <div class="spells-slot"></div>
                                    [#else]
                                        [#assign slots=spellList.spellSlots[level]]
                                        [#list 1..((slots < 3)?then(slots, 3)) as i]
                                            <div class="spells-slot"></div>
                                        [/#list]
                                    [/#if]
                                </div>
                            [/#list]
                        [/#if]
                    [/#list]
                </div>
            [#elseif spellList.casterType == "Spontaneous"]
                <div id="spells-spontaneous">
                    <div class="spells-title col-section-title">${listName} Spells</div>
                    <div class="spells-stats">
                        <div class="rollLabel">Spell Attack</div>
                        <div class="numBox rounded">${character.attributes.get(spellList.spellAttacksAttribute?lower_case, listName).total?string.@s}</div>
                        <div class="rollLabel">Spell DC</div>
                        <div class="numBox rounded">${(10 + character.attributes.get(spellList.spellDCsAttribute?lower_case, listName).total)?string}</div>
                    </div>
                    <div id="spells-spontaneous-grid">
                        [#list spellList.spellsKnown?reverse as levelSpells]
                            [#if levelSpells?size > 0]
                                [#assign level=spellList.spellsKnown?size-levelSpells?index-1]
                                [#if level == 0]
                                    <div class="spells-level" style="grid-column-end: span 2">
                                        <div class="spells-line"></div>
                                        <div class="spells-level-label">Cantrips</div>
                                        <div class="spells-line"></div>
                                    </div>
                                [#else]
                                    <div class="spells-level">
                                        <div class="spells-line"></div>
                                        <div class="spells-level-label">Level ${level}</div>
                                        <div class="spells-line"></div>
                                    </div>
                                    <div class="spells-level">
                                        <div class="spells-line"></div>
                                        [#list 1..spellList.spellSlots[level] as i]
                                            <div class="spells-slot"></div>
                                        [/#list]
                                        <div class="spells-line"></div>
                                    </div>
                                [/#if]
                                [#list levelSpells as spell]
                                    [#if spell?index % 2 == 0]
                                        <div class="spells-name left">${spell.name}</div>
                                    [#else]
                                        <div class="spells-name right">${spell.name}</div>
                                    [/#if]
                                [/#list]
                                [#if levelSpells?size % 2 == 1]
                                    <div class="spells-name right"></div>
                                [/#if]
                            [/#if]
                        [/#list]
                    </div>
                </div>
            [/#if]
            [#list spellList.spellsKnown?reverse as levelSpells]
                [#list levelSpells as spell]
                    [@spellBlock spell=spell /]
                [/#list]
            [/#list]
        [/#list]
        [#if character.spells.focusPointCount > 0]
            <div style="position: absolute; width: calc(100% / 3 - 8px)" class="do-not-break">
                <div class="spells-title col-section-title">Focus Spells</div>
            </div>
            [#list character.spells.spellLists as listName, spellList]
                [#if spellList.casterType == "None"]
                    <div id="focus-rolls" class="do-not-break">
                        <div class="spells-title col-section-title">${listName}</div>
                        <div class="spells-stats">
                            <div class="rollLabel">Spell Attack</div>
                            <div class="numBox rounded">${character.attributes.get(spellList.spellAttacksAttribute?lower_case, listName).total?string.@s}</div>
                            <div class="rollLabel">Spell DC</div>
                            <div class="numBox rounded">${(10 + character.attributes.get(spellList.spellDCsAttribute?lower_case, listName).total)?string}</div>
                        </div>
                    </div>
                [/#if]
                [#list spellList.focusSpells as spell]
                    [@spellBlock spell=spell /]
                [/#list]
            [/#list]
        [/#if]
    </div>
</div>

[#macro proficiencyDisplay proficiency grid]
    <div class="line">
        <div class="[#if grid]quad-grid[#else]quad-row[/#if]">
            <div class="prof-box rounded[#if proficiency.mod gte 2] filled[/#if]"></div>
            <div class="prof-box rounded[#if proficiency.mod gte 4] filled[/#if]"></div>
            <div class="prof-box rounded[#if proficiency.mod gte 6] filled[/#if]"></div>
            <div class="prof-box rounded[#if proficiency.mod gte 8] filled[/#if]"></div>
        </div>
        [#if grid]
        <div class="label">Prof</div>
        [/#if]
    </div>
[/#macro]
[#macro spellBlock spell]
    <div class="spell-box">
        <div class="spell-attrs">
            <div class="spell-title">
                ${spell.name}
            </div>
            [#assign numBoxes = 0]
            [#switch spell.castTime?lower_case]
                [#case "one action"]
                [#case "single action"]
                    [#assign numBoxes = 1]
                    [#break]
                [#case "two actions"]
                    [#assign numBoxes = 2]
                    [#break]
                [#case "three actions"]
                    [#assign numBoxes = 3]
                    [#break]
            [/#switch]
            [#if numBoxes &gt; 0]
            <div class="spell-cost">
                <div class="[#if numBoxes &gt;= 1] spell-cost-yes[#else]spell-cost-no[/#if]">
                    <span>♦</span>
                </div>
                <div class="[#if numBoxes &gt;= 2] spell-cost-yes[#else]spell-cost-no[/#if]">
                    <span>♦</span>
                </div>
                <div class="[#if numBoxes &gt;= 3] spell-cost-yes[#else]spell-cost-no[/#if]">
                    <span>♦</span>
                </div>
            </div>
            [#elseif spell.castTime?lower_case?contains(" to ")]
                [#switch spell.castTime?lower_case?keep_before(" to ")]
                    [#case "one"]
                    [#case "single action"]
                        [#assign minimumBoxes = 1]
                        [#break]
                    [#case "two"]
                    [#case "two actions"]
                        [#assign minimumBoxes = 2]
                        [#break]
                [/#switch]
                [#switch spell.castTime?lower_case?keep_after(" to ")]
                    [#case "two actions"]
                        [#assign maximumBoxes = 2]
                        [#break]
                    [#case "three actions"]
                        [#assign maximumBoxes = 3]
                        [#break]
                [/#switch]
            <div class="spell-cost">
                <div class="spell-cost-yes">
                    <span>♦</span>
                </div>
                <div class="spell-cost-yes[#if minimumBoxes == 1] spell-cost-optional[/#if]">
                    <span>♦</span>
                </div>
                <div class="[#if maximumBoxes == 3]spell-cost-yes spell-cost-optional[#else]spell-cost-no[/#if]">
                    <span>♦</span>
                </div>
            </div>
            [#else]
                [@linePart label="Cast Time" content=spell.castTime /]
            [/#if]
            [#assign components_string = ""]
            [#list spell.components as component]
                [#if component?is_last]
                    [#assign components_string = components_string + component[0..*1]]
                [#else]
                    [#assign components_string = components_string + component[0..*1] + ","]
                [/#if]
            [/#list]
            [@linePart label="Components" content=components_string /]
            [@linePart label="Source" content=spell.source /]
            [@linePart label="Traits" content=spell.traits?join(", ") /]
            [@linePart label="Requirements" content=spell.requirements /]
            [@linePart label="Range" content=spell.range /]
            [@linePart label="Area" content=spell.area /]
            [@linePart label="Targets" content=spell.targets /]
            [@linePart label="Duration" content=spell.duration /]
            [@linePart label="Save" content=spell.save /]
        </div>
        <div class="ability-description">
            ${spell.description}
        </div>
    </div>
[/#macro]
<div class="separator" style="top: -3px"></div>
<div class="height_measure"></div>
</body>
<script>
    function checkRefresh() {
        setTimeout(function (){
            refresh();
        }, 1000);
    }
    $( document ).ready(function() {
        window.matchMedia("print").addListener(refresh);
        window.matchMedia("screen").addListener(refresh);
        window.addEventListener('resize', checkRefresh);

        let inventoryGrid = $("#inventory-grid");
        while(true) {
            inventoryGrid.append($("<div></div><div></div><div></div>"));
            let bottom = inventoryGrid.children().last();
            bottom = bottom.position().top + bottom.outerHeight(true);
            let height = inventoryGrid.parent().outerHeight(true);
            if(bottom > height) {
                for(let j = 0; j < 3; j++)
                    inventoryGrid.children().last().remove();
                break;
            }
        }

        oldTableCopy = $(".abilities-flex").first().children().clone();
        fixRows();
    });
    function refresh() {
        $(".abilities-flex:not(:first)").remove();
        $(".separator:not(:first)").remove();
        $(".abilities-flex").first().empty();
        $(".abilities-flex").first().append(oldTableCopy.clone());
        $(".page").slice(2).remove();
        fixRows();
    }
    function moveLeft() {
        currentLeftIndex += 1;
        switch(currentLeftIndex) {
            case 1:
                currentLeft = "calc(4px + 100% / 3)";
                break;
            case 2:
                currentLeft = "calc(4px + 200% / 3)";
                break;
            case 3:
                currentLeftIndex = 0;
                currentLeft = "4px";
                let futurePage = $("<div class='page'><div class='printBorder'></div><div class='abilities-flex'></div></div>")
                    .insertAfter(currPage.parent());
                let size = Math.floor(parseFloat(currPage.parent().css("top").replace("px", "")))
                futurePage.css("top", "calc("+size+"px + "+$(".height_measure").css("height")+")");
                console.log();
                currPage = futurePage.children(".abilities-flex");
                numPages += 1;
                break;
        }
    }
    function binaryHeightSearch(text, maxHeight) {
        let contents = text.html();
        if (contents === null || contents === undefined) return "";
        let start = 0;
        let end = contents.length;
        while(start < end) {
            let middle = contents.indexOf(" ", Math.ceil((start + end) / 2));
            if(middle === -1) middle = end;
            text.html(contents.substring(0, middle));
            if(text.parent().outerHeight(true) > maxHeight) {
                end = Math.ceil((start + end) / 2) - 1;
            } else {
                start = middle;
            }
        }
        text.html(contents.substring(0, start));
        if(end < contents.length)
            text.parent().css("border-bottom", "none");
        return contents.substring(start);
    }
    function binaryDivHeightSearch(original, clone, maxHeight) {
        let contents = original.children();
        if (contents === null || contents === undefined) return "";
        let start = 0;
        let end = contents.length;
        while(start < end) {
            let middle = contents.eq(Math.floor((start + end) / 2));
            if(middle.position().top + middle.outerHeight(true) > maxHeight) {
                end = Math.floor((start + end) / 2);
            } else {
                start = Math.floor((start + end) / 2) + 1;
            }
        }
        for(let i = contents.length; i >= 0; i--) {
            if(i < start) {
                clone.children().eq(i).remove();
            }else{
                original.children().eq(i).remove();
            }
        }
        if(end < contents.length)
            original.addClass("no-bottom");
    }
    function fixRows() {
        firstPage = $(".abilities-flex").first();
        currPage = firstPage; numPages = 1;
        currentTop = 0;
        currentLeft = "4px"; currentLeftIndex = 0;
        totalHeight = firstPage.outerHeight(true);
        firstPage.children().each(function(index) {
            // Move to a new line if it would overflow and we don't want it to
            if(($(this).attr("id") === "inventory-grid"
                || $(this).attr("id") === "spells-prepared"
                || $(this).attr("id") === "spells-spontaneous"
                || $(this).hasClass("do-not-break"))
                && (totalHeight - currentTop) <= $(this).outerHeight(true)) {
                moveLeft();
                currentTop = 0;
            }
            // Completely move to next if only small space left
            let descTop = $(this).find(".ability-description");
            let infoHeight = 0;
            if(descTop != null && descTop != undefined && descTop.length > 0) {
                descTop = descTop.first();
                infoHeight = descTop.position().top;
                if(currentTop + infoHeight >= totalHeight) {
                    currentTop = 0;
                    moveLeft();
                }
            }
            // Place the element
            $(this).css("left", currentLeft);
            $(this).css("top", currentTop);
            if(currPage !== firstPage)
                $(this).appendTo(currPage);
            currentTop += $(this).outerHeight(true);

            // If overflows at all, clone remainder to next
            if(currentTop >= totalHeight) {
                currentTop -= totalHeight;
                moveLeft();
                let clone = $(this).clone();
                clone.css("left", currentLeft);
                clone.css("top", 0);
                if($(this).attr("id") === "inventory-grid"
                || $(this).attr("id") === "spells-prepared"
                || $(this).attr("id") === "spells-spontaneous") {
                    binaryDivHeightSearch($(this), clone, totalHeight - $(this).position().top);
                }else{
                    clone.children().last().html(binaryHeightSearch(descTop, totalHeight - $(this).position().top));
                    clone.children(":not(:last-child)").remove();
                }
                clone.appendTo(currPage);
                currentTop = clone.outerHeight(true);
            }
        });
        for(let i = 1; i <= numPages; i++) {
            $(".separator").last().after($("<div class='separator' style='top: calc("+i+"00vh - 3px)'></div>"));
        }
    }
</script>
</html>