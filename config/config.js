/**
 * Determines which "phase" the Go Store is at within the app. Simply set this to an integer and tell me what you want to happen at each phase. Below are some ideas...
 * 0 = Hidden from all navigation, invisible and inaccessible
 * 1 = Added to navigation with promotional, "Coming Soon" splash
 * 2 = Added to navigation, accessible and "working". This is the state when the Go Store launches, basically.
 * 3 = ...
 * 4 = ...
 */
const GO_STORE_PHASE = 0;

/**
 * List of items accessible in the store
 * param {string} name = Name of the menu item
 * param {boolean} available = Whether the item should be listed in the store
  * param {string} description = A quick bio of the menu item
 * param {string} image = A URL to the image that should be shown for the menu item
 * param {array, strings} tabs = An array of strings of the different customizations available for the menu item
 * param {array, strings} prices = An array of strings of the cost of each of the menu items listed above.
 * NOTE: The array length of "tabs" and the array length of "prices" should match. This isn't the ideal way to approach this problem, I should have used objects, but for simplicity's sake it works.
 */
const MENU_ITEMS = [
// CHRISTMAS BLEND
{
	"name": "Christmas Blend",
	"available": true,
	"description": "Rooibos, Black tea, Cinnamon, Cloves, Ginger, Cardamom Spices, Orange Peel and Cinnamon.",
	"image": "https://images.pexels.com/photos/188971/pexels-photo-188971.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
	"tabs": ["8oz", "12oz", "16oz"],
	"prices": ["3.99", "4.29", "4.49"]
},
// SPICY TIGER
{
	"name": "Spicy Tiger",
	"available": true,
	"description": "Indian & Ceylon black teas, Cinnamon chips, Orange and Cinnamon flavoring.",
	"image": "https://arrayetea.com/imgs/teas/SpicyTiger.png",
	"tabs": ["8oz", "12oz", "16oz"],
	"prices": ["3.49", "3.79", "3.99"]
},
// TIGER PAWS
{
	"name": "Tiger Paws",
	"available": true,
	"description": "Red Rooibos with Blood Orange flavoring. A very aromatic and smooth tea with no astringency.",
	"image": "https://arrayetea.com/imgs/teas/TigerPaws.png",
	"tabs": ["8oz", "12oz", "16oz"],
	"prices": ["3.49", "3.79", "3.99"]
},
// SPICY CHAIGRR
{
	"name": "Spicy ChaiGrrr",
	"available": true,
	"description": "Rooibos, Black tea, Cinnamon, Cloves, Ginger, Cardamom Spices, Orange Peel and Cinnamon.",
	"image": "https://arrayetea.com/imgs/teas/SpicyChaiGrr.png",
	"tabs": ["8oz", "12oz", "16oz"],
	"prices": ["3.49", "3.79", "3.99"]
}];

/**
 * Starbucks and Dunkin allow users to add balances from their credit cards on in-app "cards". These cards have different designs the user can select from. Some are seasonal and rare, kind of like trading cards. That's what these variables control.
 * param {string} id = The unique identifier of the particular card. Should be numerically increasing.
 * param {boolean} available = Whether or not the card design is available for the user to select. NOTE: if a card design is selected and then becomes unavailable, the user will still retain the design! They just won't be able to add the skin to a new card. Thus, when you want to take a card style offline, instead of deleting the entry, you can set "available" to false.
 * param {string} image = A URL to the image that should be shown for the card skin
 */
const CARD_STYLES = [
{
	"id": 0,
	"available": true,
	"image": "https://images.pexels.com/photos/1915401/pexels-photo-1915401.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
},

{
	"id": 1,
	"available": true,
	"image": "https://images.pexels.com/photos/1167021/pexels-photo-1167021.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
},

{
	"id": 2,
	"available": true,
	"image": "https://images.pexels.com/photos/1155577/pexels-photo-1155577.jpeg?cs=srgb&dl=daylight-environment-flow-1155577.jpg&fm=jpg"
}
];

/**
 * Tax rate, int
 */
const TAX = 0.08;