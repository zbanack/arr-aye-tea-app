function USD(amt) {
    let formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    });

    return formatter.format(amt);
}

function cart_item_manip(inc, _i, _j) {
    console.log(inc, _i, _j);

    for (var i = 0; i < cart_items.length; i++) {
        if (cart_items[i][0] == _i && cart_items[i][1] == _j) {
            cart_items[i][2] += Number(inc);
            if (cart_items[i][2] < 0) cart_items[i][2] = 0;
            break;
        }
    }

    cart_has_updated();
}

function render_cart_items() {
    $('#my-items').empty();
    let div;
    let sum = 0;
    let empty = true;
    for (let i = 0; i < cart_items.length; i++) {
        let _i = cart_items[i][0];
        let _j = cart_items[i][1];
        let _q = cart_items[i][2];

        if (_q < 1) continue;

        empty = false;

        let temp_sum = Number(_q * MENU_ITEMS[_i].prices[_j]);

        sum += temp_sum;

        div =
            `<div class="cart-item"> <button onclick="cart_item_manip(-1,${_i},${_j});">-</button><button onclick="cart_item_manip(1,${_i},${_j});">+</button><div class="img-circle" style="background-image: url('${MENU_ITEMS[_i].image}')"></div>${MENU_ITEMS[_i].name} ${MENU_ITEMS[_i].tabs[_j]} x${_q} @ ${USD(MENU_ITEMS[_i].prices[_j])} = ${USD(temp_sum)}<hr /></div>`;
        $('#my-items').append(div);
    }

    if (!empty) {
        div = `<div id="subtotal">Subtotal: ${USD(sum)}<br />TAX (${USD(TAX * 100)}%): ${USD(TAX * sum)}<hr />Total: ${USD((TAX * sum) + sum)}</div>`;
        $('#my-items').append(div);
    } else {
        div = 'Cart empty!';
        $('#my-items').append(div);
    }

}

function get_cart_size() {
    let count = 0;
    for (let i = 0; i < cart_items.length; i++) {
        count += cart_items[i][2];
    }
    return count;
}

function sortFunction(a, b) {
    if (a[0] === b[0]) {
        return 0;
    } else {
        return (a[0] < b[0]) ? -1 : 1;
    }
}

function cart_sort() {
    cart_items.sort(sortFunction);
}

function cart_has_updated() {
    $('.cart-count').text(get_cart_size());
    $('.cart-count').css('opacity', '0');
    if (get_cart_size() > 0) $('.cart-count').css('opacity', '1');
    render_cart_items();

    cart_sort();
}
$(".menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
});

function openPage(evt, cityName, btnName) {
    btnName = btnName || undefined;

    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(/ active/g, "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";

    $('.navbutton').css('opacity', '1').css('transform', 'translateY(0px)');
    if (btnName !== undefined) $('#' + btnName).css('opacity', '1').css('transform', 'translateY(-5px)');
}

function menu_get_price(_val, _class) {
    recent_item = [_val, _class];
    return MENU_ITEMS[_class].prices[_val];
}

// listen for toggle
$(document).on('change', 'input:radio[name="options"]', function(event) {
    let cls = '.' + this.className;
    $(cls).text('Add to Cart $' + menu_get_price(this.value, this.className.replace(/\D/g, "")));
});

function add_to_cart(btn) {
    console.log('here');
    let ID = btn.className.replace(/\D/g, "");
    let num = 0;
    let slides = document.getElementsByClassName("MID" + ID);
    for (let i = 0; i < slides.length; i++) {
        if ($(slides[i]).attr('type') === 'radio') {
            if ($(slides[i]).parent().get(0).className.indexOf('active') > -1) {
                num = (slides[i].value);
                break;
            }
        }

    }

    let is_new = true;
    for (var i = 0; i < cart_items.length; i++) {
        if (cart_items[i][0] == ID && cart_items[i][1] == num) {
            cart_items[i][2]++;
            is_new = false;
            break;
        }
    }

    if (is_new) cart_items.push([ID, num, 1]);

    console.log(cart_items);

    cart_has_updated();
}

$(document).ready(function() {
    cart_has_updated();
    init_popul();
    $("#success-alert").hide();
    $(".add-to-cart").click(function showAlert() {
        add_to_cart(this);
        $("#success-alert").stop(true, true);
        $("#success-alert").fadeTo(2000, 500).slideUp(500, function() {
            $("#success-alert").slideUp(500);
        });
    });
});

function init_popul() {
    for (let i = 0; i < MENU_ITEMS.length; i++) {
        let div = `<div class="card" style="width: 100%;">
  <div class="card-img-top" style="background-image: url('${MENU_ITEMS[i].image}')"></div>
  <div class="card-body">
    <h5 class="card-title">${MENU_ITEMS[i].name}</h5>
    <p class="card-text">${MENU_ITEMS[i].description}</p>

  <div class="card-add">
      <div class="btn-group btn-group-toggle" data-toggle="buttons">`

        for (let j = 0; j < MENU_ITEMS[i].tabs.length; j++) {
            div += `
        <label class="hollow btn btn-secondary${j === 0 ? ' active' : ''}">
          <input class="MID${i}" type="radio" name="options" autocomplete="off" value="${j}">${MENU_ITEMS[i].tabs[j]}
        </label>
            `;
        }

        div += `</div>

        <a href="javascript:;" class="MID${i} badge badge-pill badge-success add-to-cart">Add to Cart $${MENU_ITEMS[i].prices[0]}</a>
    </div>
  </div>
</div>`;
        $('#menu-listing').append(div);
    }

    // news stories
    for (let i = 0; i < NEWS_STORIES.length; i++) {
        let categs = ``;
        for (var j = 0; j < NEWS_STORIES[i].categories.length; j++) {
            categs += `<span class="badge badge-light badge-light">${NEWS_STORIES[i].categories[j]}</span>&nbsp;`;
        }
        let div = `<div class="card" style="width: 100%; background: linear-gradient(rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.8)), url('${NEWS_STORIES[i].image}') no-repeat fixed;background-size: cover;">
  <div class="card-body news-body">

    <h4 class="card-title">${NEWS_STORIES[i].title}</h4>
    <div class="card-title news-author">${NEWS_STORIES[i].author}</div>
    
    <p class="card-text">${NEWS_STORIES[i].digest}</p>


  <div class="card-add">
  <div class="row">
    <div class="col" style="text-align:left; padding-top:5px;">
      ${categs}
    </div>
    <div class="col">
      <div class="btn-group btn-group-toggle" data-toggle="buttons">
        <a href="${NEWS_STORIES[i].URL}" class="MID${i} badge badge-pill badge-primary read-more">Read More &raquo;</a>
    </div>
    </div>
  </div>

  </div>
</div>`;
        $('#news-stories').append(div);
    }

    // cards
    render_cards();

    let div = '';
    // card selection
    for (let i = 0; i < CARD_STYLES.length; i++) {
        if (CARD_STYLES[i].available !== true) continue;
        div += `<label class="aat-card-sm card-style-selection btn btn-secondary${i === 0 ? ' active' : ''}" style="background-image:url('${card_get_image(i.toString())}') !important;">
          <input class="card-radio-selection" type="radio" name="card-style-radio" autocomplete="off" value="${i}">
        </label>`;
    }

    $('#card-selection').append(div);
}

function render_card_view(i) {
    $('#card-view').empty();
    let div = render_card(CARDS[i].style);
    $('#card-view').append(div);
    div = `<p>${USD(CARDS[i].balance)}<br/>${CARDS[i].number}</p>`;
    $('#card-view').append(div);
    alert(card_to_int(CARDS[i].number));
    gen_qr();
}

function render_card(img) {
    //$('#card-view').empty();
    return `<div class="aat-card" style="background-image:url('${card_get_image(img)}');"></div><div></div>`;
}

function render_cards() {
    $('#my-cards').empty();
    for (let i = 0; i < CARDS.length; i++) {
        let div = render_card(CARDS[i].style);
        let div_pre = `<a href="javascript:void(0);" class="tablinks" onclick="render_card_view(${i}); openPage(event, 'page-view-card', -1)">`;
        let div_post = `</a>`;

        $('#my-cards').append(div_pre + div + div_post);
    }
}

function card_get_image(_sty) {
    let ret = '';
    for (let i = 0; i < CARD_STYLES.length; i++) {
        if (CARD_STYLES[i].id === _sty) {
            ret = CARD_STYLES[i].image;
            break;
        }
    }
    return ret;
}

function create_card() {
    let id = '';
    let balance = $('input[name=card-bal]').val();
    let style = $('input[name=card-style-radio]:checked').val();

    CARDS.push({
        "id": id,
        "number": generate_card_number(),
        "balance": balance,
        "style": style
    });

    console.log(CARDS);
}

function pad_number(numb) {
    let str = numb.toString();
    while (str.length < 4) {
        str = '0' + str;
    }
    return str;
}

function card_to_int(numb) {
    let res = numb.replace(/\D/g, "");
    let ret = '';

    for (let i = 0; i < 10; i++) {
        ret += res.toString();
    }
    return ret;
}

function generate_card_number() {
    let numb = 0;
    for (let i = 0; i < 4; i++) {
        numb += pad_number(Math.floor(Math.random() * 9999) + 0);
        if (i < 3) numb += ' ';
    }
    return numb;
}

function gen_qr() {
    // TODO, use card_to_int substring instead of > 0.5 to generate QR code
    $('#qr-code').empty();
    let qr_cols = 8;
    let qr_rows = 16;
    let div = `<table id="qr-table">`;
    for (let i = 0; i < qr_cols; i++) {
        div += `<tr>`;
        for (let j = 0; j < qr_rows; j++) {
            let ch = (Math.random(1) > 0.5 || j == qr_rows - 2) ? 'qrb' : 'qrw';
            div += `<th class="${ch}"></th>`;
        }
        div += `</tr>`;
    }
    div += `</table>`;
    $('#qr-code').append(div);
} // This is just a sample script. Paste your real code (javascript or HTML) here.

if ('this_is' == /an_example/) {
    of_beautifier();
} else {
    var a = b ? (c % d) : e[f];
}