/**
 * Storables
 */
let ORDER_HISTORY = [];
let CARDS = [];
let recent_item = [];
let cart_items = [];
let cards = [];

/**
 * Side panel toggling
 */
$(".menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
});

/**
 * Radio button has changed; used when the size of a menu item is clicked (e.g. user changes from small size to medium size)
 */
$(document).on('change', 'input:radio[name="options"]', function(event) {
    let cls = '.' + this.className;
    $(cls).text('+ $' + menu_get_price(this.value, this.className.replace(/\D/g, "")));
});

/**
 * USD formats a given value $1,234.56
 * @param {real} amt - Number to convert to USD format
 */
function USD(amt) {
    let formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    });

    return formatter.format(amt);
}

/**
 * Increases/decreases quantity of item in cart
 * @param {real} int - Positive or negative integer
 * @param {real} _i - array dimension 0 of item
 * @param {real} _j - array dimension 1 of item
 */
function cart_item_manip(inc, _i, _j) {

    // scan cart items until we encounter desired item
    for (var i = 0; i < cart_items.length; i++) {
        if (cart_items[i][0] == _i && cart_items[i][1] == _j) {

            // increase/decrease particular cart item
            cart_items[i][2] += Number(inc);

            // prevent 0 underflow
            if (cart_items[i][2] < 0) cart_items[i][2] = 0;
            break; // operation complete, break
        }
    }

    cart_has_updated();
}

/**
 * Lists all items that have been added to the cart
 */
function render_cart_items() {
    $('#my-items').empty();
    let div;
    let sum = 0;
    let empty = true;

    // iterate over all items in cart
    for (let i = 0; i < cart_items.length; i++) {
        // reference to given cart index in 2d array, quantity
        let _i = cart_items[i][0];
        let _j = cart_items[i][1];
        let _q = cart_items[i][2];

        // skip if no quantity
        if (_q < 1) continue;

        empty = false;

        // increase sum, total cost of items in cart
        let temp_sum = Number(_q * MENU_ITEMS[_i].prices[_j]);
        sum += temp_sum;

        // add cart item to list, render
        div = `<div class="cart-item"><div class="add-sub-wrap"><button class="circ badge badge-pill badge-primary" onclick="loading_show(1000, cart_item_manip, -1,${_i},${_j});">-</button></div>&nbsp;&nbsp;<div class="add-sub-wrap"><button class="circ badge badge-pill badge-primary" onclick="loading_show(1000, cart_item_manip, 1,${_i},${_j});">+</button></div><div class="add-sub-wrap"><div class="img-circle" style="background-image: url('${MENU_ITEMS[_i].image}')"></div></div>${MENU_ITEMS[_i].name} ${MENU_ITEMS[_i].tabs[_j]} x${_q} @ ${USD(MENU_ITEMS[_i].prices[_j])} = ${USD(temp_sum)}</div>`;
        $('#my-items').append(div);
    }

    // if there is at least one item in the cart
    if (!empty) {
        let total_price = (USD((TAX * sum) + sum)).toString();

        // Subtotal, tax, total price div
        div = `<div id="subtotal">Subtotal: ${USD(sum)}<br />Tax (${(TAX * 100)}%): ${USD(TAX * sum)}Total: ${total_price}`;

        // checkout button
        div += `<br/><div style="text-align:center"><a href="javascript:void(0);" class="badge badge-pill badge-primary checkout-btn" href="javascript:void(0);" onclick="loading_show(2000, checkout, '${total_price}');" style="padding:10px; margin-top:20px; margin-bottom:40px;">Checkout</a></div></div>`;
        $('#my-items').append(div);
    } else {
        // if the cart is empty, Call to Action button
        div = `<div class="empty-cart motion"><h3><i class="fas fa-shopping-cart"></i></h3><br/>Your cart\'s empty!<br/><br/><a href="javascript:void(0);" class="badge badge-pill badge-primary" onclick="openPage(event, 'page-shop', 'ico-shop')" style="padding:10px;">Add something tasty</a></div>`;
        $('#my-items').append(div);
    }

}

/**
 * Returns the number of items in the cart
 */
function get_cart_size() {
    let count = 0;
    for (let i = 0; i < cart_items.length; i++) {
        count += cart_items[i][2];
    }
    return count;
}

/**
 * Sorts model array by reference array
 * @param {real} a - model array
 * @param {real} b - reference array
 */
function sortFunction(a, b) {
    if (a[0] === b[0]) {
        return 0;
    } else {
        return (a[0] < b[0]) ? -1 : 1;
    }
}

/**
 * Sorts the items in cart
 */
function cart_sort() {
    cart_items.sort(sortFunction);
}
/**
 * Cart has just been maniuplated, handle changes
 */
function cart_has_updated() {
    // get number of items stored in count
    $('.cart-count').text(get_cart_size());

    // modify symbol opacity based on cart being empty or not
    $('.cart-count').css('opacity', '0');
    if (get_cart_size() > 0) $('.cart-count').css('opacity', '1');

    // re-render cart items
    render_cart_items();

    // re-sort cart
    cart_sort();
}

/**
 * Opens a given page
 * @param {event} evt
 * @param {element} pageName - Name of page to open
 * @param {element} btnName - (optional) Update nav button associated with page
 */
function openPage(evt, pageName, btnName) {
    // optional button param, set to undefined if not passed
    btnName = btnName || undefined;

    let currentTarget = undefined;
    let tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");

    // clear all tabs
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    // remove "active" class from all tab links
    tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(/ active/g, "");
    }

    // make selected page visible
    document.getElementById(pageName).style.display = "block";

    // append active tag to page
    if (currentTarget !== undefined) evt.currentTarget.className += " active";

    // $('.navbutton').css('opacity', '1').css('transform', 'translateY(0px)');

    // apply movement to button, if defined
    //if (btnName !== undefined) $('#' + btnName).css('opacity', '1').css('transform', 'translateY(-5px)');
}

/**
 * Returns the price of an item given
 * @param {real} _val - array dimension 0 of item
 * @param {real} _class - array dimension 1 of item
 */
function menu_get_price(_val, _class) {
    recent_item = [_val, _class];
    return MENU_ITEMS[_class].prices[_val];
}

/**
 * Remove all items from the cart
 */
function cart_empty() {
    // clear array of held cart items
    cart_items = [];

    // signal that there has been a change to the cart
    cart_has_updated();
}

/**
 * Add a menu item into the user's cart
 * @param {element} btn - button that references particular variation (small, medium, large, etc.) of menu item 
 */
function add_to_cart(btn) {
    // strip all classes from class name to derive specific attributes
    let ID = btn.className.replace(/\D/g, "");
    let num = 0;

    // get menu ID (MID), associated radio buttons
    let slides = document.getElementsByClassName("MID" + ID);

    // iterate over radio buttons
    for (let i = 0; i < slides.length; i++) {

        // sanity check to ensure we're dealing with radio buttons
        if ($(slides[i]).attr('type') === 'radio') {

            // if this radio button is the one that's selected, use its value (price)
            if ($(slides[i]).parent().get(0).className.indexOf('active') > -1) {
                num = (slides[i].value);
                break;
            }
        }
    }

    // determine whether this is the first of the specific item to be added to the user's cart
    let is_new = true;

    // iterate over entire cart
    for (var i = 0; i < cart_items.length; i++) {
        // if we encounter the item in our cart already
        if (cart_items[i][0] == ID && cart_items[i][1] == num) {

            // increase the quantity and break
            cart_items[i][2]++;
            is_new = false;
            break;
        }
    }

    // if we do not encounter the item in our cart already, push the item to the cart
    if (is_new) cart_items.push([ID, num, 1]);

    //console.log(cart_items);

    // cart needs to be updated visually
    cart_has_updated();
    
    // flash banenr that the item was successfully added
    alert_success('Yum!', 'Item addded to cart');
}

/**
 * Creates an alert indicating success
 * @param {real} _title - Title of the success alert
 * @param {real} _content - Content of the success alert
 */
function alert_success(_title, _content) {
    let div = `<strong>${_title}</strong>&nbsp;${_content}`;
    $("#success-alert").empty();
    $("#success-alert").append(div);
    $("#success-alert").stop(true, true);
    $("#success-alert").fadeTo(2000, 500).slideUp(500, function() {
        $("#success-alert").slideUp(500);
    });
}

/**
 * Creates an alert indicating failure
 * @param {real} _title - Title of the failure alert
 * @param {real} _content - Content of the failure alert
 */
function alert_failure(_title, _content) {
    let div = `<strong>${_title}</strong>&nbsp;${_content}`;
    $("#failure-alert").empty();
    $("#failure-alert").append(div);
    $("#failure-alert").stop(true, true);
    $("#failure-alert").fadeTo(2000, 500).slideUp(500, function() {
        $("#failure-alert").slideUp(500);
    });
}

/**
 * Called once the user has logged in and the server request was successful
 * @param {string} pulled_data - Data pulled from server 
 */
function app_has_loaded(pulled_data) {
    // fade out the landing page
    $('#landing').fadeOut();

    // update cart in order to prime it
    cart_has_updated();

    // popuplate news and menu items
    init_popul(pulled_data);

    // hide success alerts, should they exist
    $("#success-alert").hide();

    // listener to add to cart buttons, show loading and cart manipulation callbacks
    $(".add-to-cart").click(function showAlert() {
        loading_show(500, add_to_cart, this);
    });

    // hide loading spinner that appeared during server request
    loading_hide();
}

/**
 * Populate the news stories and menu items
 */
function init_popul(pulled_data) {

    // assign API return data to NEWS_STORIES for further parsing
    NEWS_STORIES = JSON.parse(pulled_data);

    // iterate over all menu items
    for (let i = 0; i < MENU_ITEMS.length; i++) {

        // skip over if the menu item isn't available (for example, seasonal item)
        if (!MENU_ITEMS[i].available) continue;
        let div = `<div class="card side-by-side">
  <div class="card-img-top" style="background-image: url('${MENU_ITEMS[i].image}')"></div>
  <div class="card-body">
    <h5 class="card-title">${MENU_ITEMS[i].name}</h5>
    <p class="card-text">${MENU_ITEMS[i].description}</p>

  <div class="card-add">
      <div class="btn-group btn-group-toggle" data-toggle="buttons">`


      // iterate over all variations (tabs) for the specific menu item
        for (let j = 0; j < MENU_ITEMS[i].tabs.length; j++) {
            div += `
        <label class="hollow btn btn-secondary${j === 0 ? ' active' : ''}">
          <input class="MID${i}" type="radio" name="options" autocomplete="off" value="${j}">${MENU_ITEMS[i].tabs[j]}
        </label>
            `;
        }

        // close div, default Add to Cart button
        div += `</div>

        <a href="javascript:;" class="MID${i} badge badge-pill badge-success add-to-cart">+ $${MENU_ITEMS[i].prices[0]}</a>
    </div>
  </div>
</div>`;

    // append menu item to div
        $('#menu-listing').append(div);
    }

    // iterate over the news stories
    for (let i = 0; i < NEWS_STORIES.length; i++) {
        let inside = false;
        let matches_tags = [];
        let fallback_source = 'Article';
        let __str = NEWS_STORIES[i].title.toLowerCase();
        let source = NEWS_STORIES[i].fromID || '';

        // if the news stories contains a source
        if (source == undefined || source == null 
        || typeof source == typeof undefined) source = '';
            if (source.length<3) source = fallback_source;

        // scan for keywords
        for(var j = 0; j < NEWS_TAG_KEYWORDS.length; j++) {
            
            // basic checkin for word, lowercase
            let seek = NEWS_TAG_KEYWORDS[j].toLowerCase();

            // found keyword
            if (__str.indexOf(seek)>-1) {
                inside = true;
                matches_tags.push(NEWS_TAG_KEYWORDS[j]);
            }
        }

        // if we should load the news story
        if (inside) {
            let splitter = NEWS_STORIES[i].content.trunc(140);
            let categs = ``;
            let __img = NEWS_STORIES[i].attach || '';

            // check if the story has an associated ("attach") image
            if ((__img.length) < 5) __img = NEWS_IMAGE_DEFAULT;

            // list out the matched tags
            for (var j = 0; j < matches_tags.length; j++) {
                categs += `<span class="badge badge-light badge-light">${matches_tags[j]}</span>&nbsp;`;
            }

            // create the news card
            let div = `<div class="card" style="width: 100%; background: linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.8)), url('${__img}') no-repeat fixed;background-size: cover;">
      <div class="card-body news-body">

        <h4 class="card-title">${NEWS_STORIES[i].title}</h4>
        <div class="card-title news-author">${source}</div>
        
        <p class="card-text">${splitter}</p>


      <div class="card-add">
      <div class="row">
        <div class="col" style="text-align:left; padding-top:5px;">
          ${categs}
        </div>
        <div class="col">
          <div class="btn-group">
            <a href="${NEWS_STORIES[i].url}" target="_blank" class="MID${i} badge badge-pill badge-primary read-more">Read More &raquo;</a>
        </div>
        </div>
      </div>

      </div>
    </div>`;

        // add the news card to the view
            $('#news-stories').append(div);
        }
    }

    // render the credit cards
    render_cards();

    let div = '';

    // load in the credit cards faces, if available
    for (let i = 0; i < CARD_STYLES.length; i++) {
        if (CARD_STYLES[i].available !== true) continue;
        div += `<label class="aat-card-sm card-style-selection btn btn-secondary${i === 0 ? ' active' : ''}" style="background-image:url('${card_get_image(i.toString())}') !important;">
          <input class="card-radio-selection" type="radio" name="card-style-radio" autocomplete="off" value="${i}">
        </label>`;
    }

    $('#card-selection').append(div);
}

/**
 * Truncates a string with ('...') if length exceeds
 */
String.prototype.trunc = String.prototype.trunc ||
  function(n){
      return (this.length > n) ? this.substr(0, n-1) + '&hellip;' : this;
  };

/**
 * Renders a given credit card's associated information (QR code, balance)
 * @param {real} i - index of card to render
 */
function render_card_view(i) {
    // clear the card view
    $('#card-view').empty();
    let div = render_card(CARDS[i].style);
    $('#card-view').append(div);

    // add the balance below the card
    div = `<p>${USD(CARDS[i].balance)}<br/>${CARDS[i].number}</p>`;
    $('#card-view').append(div);

    // generate the associated card QR code
    gen_qr(i);
}

/**
 * Renders a particular credit card image
 * @param {string} img - The background image to draw in the card
 */
function render_card(img) {
    //$('#card-view').empty();
    return `<div class="aat-card" style="background-image:url('${card_get_image(img)}');"></div><div></div>`;
}

/**
 * Displays all credit cards associated with the user in the view, using helper scripts to display individual components
 */
function render_cards() {
    // empty div
    $('#my-cards').empty();

    // iterate over the cards
    for (let i = 0; i < CARDS.length; i++) {

        // render particular card
        let div = render_card(CARDS[i].style);
        let div_pre = `<a href="javascript:void(0);" class="tablinks" onclick="render_card_view(${i}); openPage(event, 'page-view-card', -1)">`;
        let div_post = `</a>`;

        // add card to div
        $('#my-cards').append(div_pre + div + div_post);
    }

    if (CARDS.length<1) {
        let div = `<div class="empty-cart motion"><h3><i class="fas fa-credit-card"></i></h3><br/>Add a payment method to your account<br/><br/><a href="javascript:void(0);" class="badge badge-pill badge-primary" onclick="openPage(event, 'page-add-card', 'ico-shop')" style="padding:10px;">Design my card!</a></div>`;
        $('#my-cards').append(div);
    }
    else {
        let div = `<div class="d-flex"><a href="javascript:void(0);" class="btn-center badge badge-pill badge-primary" onclick="openPage(event, 'page-add-card', 'ico-shop')" style="padding:10px;">Add a card</a></div>`;
        $('#my-cards').append(div);
    }
}
/**
 * Get the particular image associated with the card
 * @param {string} _str - The index of the card requesting the style
 */
function card_get_image(_sty) {
    let ret = '';
    // iterate over all possible card styles
    for (let i = 0; i < CARD_STYLES.length; i++) {
        // if style match, return particular image
        if (CARD_STYLES[i].id === _sty) {
            ret = CARD_STYLES[i].image;
            break;
        }
    }
    return ret;
}

/**
 * Creates a new credit card associated with the user
 */
function create_card() {
    let id = '';
    // pull information from fields
    let balance = $('input[name=card-bal]').val();
    let style = $('input[name=card-style-radio]:checked').val();

    // push the card to the stack
    CARDS.push({
        "id": id,
        "number": generate_card_number(),
        "balance": balance,
        "style": style
    });

    //console.log(CARDS);
}

/**
 * Pads out number with leading zeroes if length is less than 4
 * @param {int} numb - Number to pad out
 * @returns {string} str - String copy of padded input
 */
function pad_number(numb) {
    let str = numb.toString();
    while (str.length < 4) {
        str = '0' + str;
    }
    return str;
}

/**
 * Cleans a card's string, rounding and removing spaces
 * @param {string} numb - The credit card number as a string
 * @returns {string} ret - A cleaned credit card string
 */
function card_to_int(numb) {
    let res = numb.replace(/\D/g, "");
    let ret = '';

    for (let i = 0; i < 10; i++) {
        ret += (Math.round(res * (i / 4))).toString();
    }
    return ret;
}

/**
 * Generates a fake, random credit card number
 */
function generate_card_number() {
    let numb = 0;
    for (let i = 0; i < 4; i++) {
        // append padded, random number
        numb += pad_number(Math.floor(Math.random() * 9999) + 0);
        if (i < 3) numb += ' ';
    }
    return numb;
}

/**
 * Generates a fade "QR Code" for a given credit card
 */
function gen_qr(id) {
    // TODO, use card_to_int substring instead of > 0.5 to generate QR code


    let str = card_to_int(CARDS[id].number);

    // empty the code container
    $('#qr-code').empty();

    // create table of the given dimensions to house the code
    let qr_cols = 8;
    let qr_rows = 16;
    let div = `<table id="qr-table">`;
    let cnt = 0;

    // iterate over the columns of the credit card
    for (let i = 0; i < qr_cols; i++) {
        div += `<tr>`;
        // iterate over the rows of the credit card
        for (let j = 0; j < qr_rows; j++) {
            // assign either black or white to a given cell
            let ch = ((Number(str.substring(cnt, cnt + 1)) / 10 > 0.5) || j == qr_rows - 2) ? 'qrb' : 'qrw';
            div += `<th class="${ch}"></th>`;
            cnt++;
        }
        div += `</tr>`;
    }

    // finish off table, append to div
    div += `</table>`;
    $('#qr-code').append(div);
}

/**
 * Requests checkout of the qiven price
 * @param {int} price - The value of the user's cart
 */
function checkout(price) {
    // push order history
    ORDER_HISTORY.push({
        total: price,
        date: make_date()
    });

    //console.log(ORDER_HISTORY);

    // update order history
    update_order_history();

    // open the Thank You page
    openPage(event, 'page-thankyou', -1);

    // empty the cart
    cart_empty();
}

/**
 * Updates the order history of the user
 */
function update_order_history() {
    // clear the container housing the previous orders
    $('#order-history').empty();

    // iterate over order history
    for (let i = 0; i < ORDER_HISTORY.length; i++) {
        // append particular order history to the container
        let div = `<p>Date: ${ORDER_HISTORY[i].date}</p><p>Total Price: ${ORDER_HISTORY[i].total}</p><hr/>`;
        $('#order-history').append(div);
    }

    if (ORDER_HISTORY.length < 1) {
        let div = `<div class="empty-cart motion"><h3><i class="fas fa-receipt"></i></h3><br/>You haven't ordered anything yet. Let's change that!<br/><br/><a href="javascript:void(0);" class="badge badge-pill badge-primary" onclick="openPage(event, 'page-shop', 'ico-shop')" style="padding:10px;">Browse menu</a></div>`;
        $('#order-history').append(div);
    }
}

/**
 * Generates date as string
 */
function make_date() {
    let options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    let today = new Date();

    // follows English US formatting
    return today.toLocaleDateString("en-US", options);

}

/**
 * Creates a loading spinner with a callback function and optional parameters
 * @param {int} duration - how long the spinner should appear, -1 for indefinite
 * @param {function} cbfnc - Callback function, triggers when loading is complete
 * @param {param} cbp1 - First, optional callback function parameter
 * @param {param} cbp2 - Second, optional callback function parameter
 * @param {param} cbp3 - Third, optional callback function parameter
 * @param {param} cbp4 - Fourth, optional callback function parameter
 * @param {param} cbp5 - Fifth, optional callback function parameter
 */
function loading_show(duration, cbfnc, cbp1, cbp2, cbp3, cbp4, cbp5) {
    // optional parameters
    duration = duration || -1;
    cbfnc = cbfnc || undefined;
    cbp1 = cbp1 || 0;
    cbp2 = cbp2 || 0;
    cbp3 = cbp3 || 0;
    cbp4 = cbp4 || 0;
    cbp5 = cbp5 || 0;

    // if fader already exists, refresh state
    $('#loader').empty();
    $('#loader').fadeIn();

    let div = `<div class="spinner_wrapper">
    <div class="spinner_container">
    <div class="spinner"><i class="fas fa-leaf"></i></div>
    </div>
    </div>`;

    // add loader to page
    $('#loader').append(div);

    // set timeout to loader
    if (duration > 0) setTimeout(loading_hide, duration);

    // pass in optional parameters to callback function, should it be defined
    if (cbfnc !== undefined) {
        setTimeout(function() {
            // console.log(cbp1, cbp2, cbp3, cbp4, cbp5);
            cbfnc(cbp1, cbp2, cbp3, cbp4, cbp5);
        }, duration)
    }
}

/**
 * Loading has complete, hide spinner
 */
function loading_hide() {
    $('#loader').fadeOut();
}

/**
 * The login was successful, fetch information frm server
 */
function login_successful() {
    // show loading spinner
    loading_show(-1);

    // open main page
    openPage(event, 'page-shop', 'ico-shop');

    // ajax request to server
    let URL = API_URL;

    $.ajax({
        url: URL,
        type: 'GET',
        success: function(resp) {
            // connection was successful, pass response data
            app_has_loaded(resp);
        },
        // connection could not be established
        error: function(e) {
            console.log('Error:', e);
            alert_failure('Uh oh!', 'Could not load data. Please try again later.');
        }
    });
}

/**
 * Attempts to log in the user
 */
function login() {
    // grab username and password field values
    let username = $('#inputEmail').val();
    let password = $('#inputPassword').val();

    // compare username and password
    // WARNING: his is a faux login system; an actual account verification should be much more secure (hashing, compare sever-side instead of client-side)
    if (username === 'admin' && password === '123') {
        // login was successful
        login_successful();
    } else {
        // login was incorrect
        alert_failure('Whoops!', 'Invalid username and password');
    }
}

/**
 * Simulates a logout by refreshing the page
 */
function logout() {
    location.reload();
}

function storyProgress(saga) {
    let div = '';
    let ID = '';
    switch(saga) {
        case('pw'):
            ID = 'STORY-PASSWORD-RESET';
            switch(STORY_PASSWORD_RESET) {
                case(0):
                div=`<p>Don't worry, it happens to everyone. Let's get your back in!</p>

                <br />

                <label for="reset-user">First, what's your username?</label>
                <input type="text" class="form-control form-control-sm" id="card-first" placeholder="Username">

                <label for="reset-email">Next, what email should we send reset intructions to?</label>
                <input type="text" class="form-control form-control-sm" id="card-first" placeholder="Email address">`;

                div+=resetPasswordButton();
                div+=backButton();
                break;
                case(1):
                div=`<p>Password resetting is currently unavailable. We're deeply sorry for any inconvenience this may cause.</p>`;
                div+=backButton();
                break;
            }
        break;
        case('login'):
            ID = 'STORY-LOGIN';
            switch(STORY_LOGIN) {
                case(0):
                    div=`App login is currently unavailable<br/>(add '?login=1' param to url)`;
                break;
                case(1):
                    div=`<a href="javascript:void(0);" class="btn btn-primary mb-2 bora wide-button" onclick="login();">Log In</a>`;
                break;
            }
        break;
    }

    $('#'+ID).empty();
    $('#'+ID).append(div);
}

function resetPasswordButton() {
    return `<a href="javascript:void(0);" class="badge badge-pill badge-primary" onclick="openPage(event, 'page-login', 'ico-shop')" style="padding:10px;">Send reset instructions</a>`;
}

function backButton() {
    return `<a href="javascript:void(0);" class="badge badge-pill badge-primary" onclick="openPage(event, 'page-login', 'ico-shop')" style="padding:10px;">Back</a>`;
}