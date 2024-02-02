
const fs = require('node:fs');

const tftJson = require('./tft_en_us.json');


const parseTftJson = (json) => {

	const { items, sets } = json;
	/*
	{
  "apiName": "TFT_Consumable_ChampionDuplicator_III",
  "associatedTraits": [],
  "composition": [],
  "desc": "Use on a 3-cost champion or less to create a 1-star copy on your bench.<br><br><tftitemrules>[Consumable - This item disappears when used.]</tftitemrules>",
  "effects": {},
  "from": null,
  "icon": "ASSETS/Maps/Particles/TFT/Item_Icons/Consumables/ChampionDuplicator_III.tex",
  "id": null,
  "incompatibleTraits": [],
  "name": "Lesser Champion Duplicator",
  "unique": false
}
	 */
	const itemsMap = {}
	const itemsNames = {}
	const augmentsMap = {}
	const augmentsNames = {}
	for (const [index, item] of items.entries()) {
		// TFT_Consumable_ChampionDuplicator_III -> Champion Duplicator III
		// TFT9_Augment_SettTheBoss
		// TFT9_Item_StrategistEmblem
		// If includes .*_Item_ add to items
		// If includes .*_Augment_ add to augments
		if(item.apiName.includes('_Item_')) {
			const { apiName, name } = item;
			const realName = apiName.split('_').slice(2).join('');

			itemsMap[apiName] = index;
			itemsNames[apiName] = realName;
		} else if(item.apiName.includes('_Augment_')) {
			const { apiName, name } = item;
			const realName = apiName.split('_').slice(2).join('');

			augmentsMap[apiName] = index;
			augmentsNames[apiName] = realName;
		}

	}
	// Write it to a item_indices_set10.json
	fs.writeFileSync('indices_set10.json', JSON.stringify(itemsMap, null, 2))
	// Write it to a item_names_set10.json
	fs.writeFileSync('names_set10.json', JSON.stringify(itemsNames, null, 2))
	// Write it to a augment_indices_set10.json
	fs.writeFileSync('augment_indices_set10.json', JSON.stringify(augmentsMap, null, 2))
	// Write it to a augment_names_set10.json
	fs.writeFileSync('augment_names_set10.json', JSON.stringify(augmentsNames, null, 2))

	const { champions, traits } = sets[10]

	const championsMap = {}
	const championsNames = {}
	const traitsMap = {}
	const traitsNames = {}

	for (const [index, champion] of champions.entries()) {
		const { apiName, name } = champion;
		const realName = apiName.split('_').slice(1).join('');

		championsMap[apiName] = index;
		championsNames[apiName] = realName;
	}

	for (const [index, trait] of traits.entries()) {
		const { apiName, name } = trait;
		const realName = apiName.split('_').slice(1).join('');

		traitsMap[apiName] = index;
		traitsNames[apiName] = realName;
	}

	// Write it to a champion_indices_set10.json
	fs.writeFileSync('champion_indices_set10.json', JSON.stringify(championsMap, null, 2))
	// Write it to a champion_names_set10.json
	fs.writeFileSync('champion_names_set10.json', JSON.stringify(championsNames, null, 2))
	// Write it to a trait_indices_set10.json
	fs.writeFileSync('trait_indices_set10.json', JSON.stringify(traitsMap, null, 2))
	// Write it to a trait_names_set10.json
	fs.writeFileSync('trait_names_set10.json', JSON.stringify(traitsNames, null, 2))

}

parseTftJson(tftJson)
