<?php
header("Access-Control-Allow-Origin: *");
?>
<script>
const MENU_ITEMS = [{
	"name": "Yummy!",
	"description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
	"image": "https://images.pexels.com/photos/405238/pexels-photo-405238.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
	"tabs": ["8oz", "12oz", "16oz", "24oz"],
	"prices": ["2.99", "3.49", "3.99", "4.49"]
}, {
	"name": "Even more yummy!",
	"description": "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
	"image": "https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
	"tabs": ["8oz", "12oz", "16oz"],
	"prices": ["2.99", "3.49", "3.99"]
},];

const NEWS_STORIES = [{
	"title": "News article 1",
	"digest": "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
	"image": "https://images.pexels.com/photos/1902785/pexels-photo-1902785.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
	"URL": "https://google.com",
	"categories": ['category1', 'category2', 'third category'],
	"author": "Beans Now"
},
{
	"title": "News article 2",
	"digest": "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
	"image": "https://images.pexels.com/photos/374870/pexels-photo-374870.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
	"URL": "https://google.com",
	"categories": ['very very long category'],
	"author": "Beans Now"
}
,{
	"title": "News article 3",
	"digest": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
	"image": "https://images.pexels.com/photos/1907054/pexels-photo-1907054.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
	"URL": "https://google.com",
	"categories": ['tag'],
	"author": "Beans Now"
}];

const CARD_STYLES = [{
	"id": "0",
	"available": true,
	"image": "https://images.pexels.com/photos/1915401/pexels-photo-1915401.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
},
{
	"id": "1",
	"available": true,
	"image": "https://images.pexels.com/photos/1167021/pexels-photo-1167021.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
},
{
	"id": "2",
	"available": true,
	"image": "https://images.pexels.com/photos/1155577/pexels-photo-1155577.jpeg?cs=srgb&dl=daylight-environment-flow-1155577.jpg&fm=jpg"
},];

let ORDER_HISTORY = [];

let CARDS = [];

const TAX = 0.08;
</script>