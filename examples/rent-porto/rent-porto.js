/*jslint nomen: true, node: true*/

// TODO: Check title from Sapo
// TODO: Check img from BPI
// TODO: Check price from BPI
// TODO: Check img from Trovit
// TODO: Check data from Trovit, seems it isn't coming enough data
// TODO: Check price from Sapo
// TODO: Check title from Sapo
// TODO: Data from Sapo is not working right

'use strict';

var searchCriteria,
    databases,
    Crawler = require('../../Crawler'),
    crawler = new Crawler();


searchCriteria = {
    'timer': 1000,

    'search-modifiers': {
        'min-price': 300,
        'max-price': 450,

        'aim': 'rent',
        'type': 'flat',
        'min-rooms': '1',
        'max-rooms': '2',

        'city': 'porto'
    },

    'keywords': ['garagem'],
    'not-keywords': ['sem garagem', 't0', 't3', 't4', 't5', 'moradia', 'ismai', 'gulpilhares', 'ermesinde', 'paranhos', 'avintes', 'espinho', 'antas', 'perosinho', 'canelas', 'santo tirso', 'paredes', 'os de ferreira', 'serezedo', 'carvalhos', 'a da palmeira', 'lix da marinha', 'oliveira do douro', 'vilar do para', 'canelas', 'valadares', 'gondomar', 'valongo', 'maia', 'gondomar', 'mamede infesta', 'mamede de infesta', 'pedroso', 'voa de varzim', 'matosinhos', 'campanh', 'senhora da hora', 'vermoim', 'aldoar', 'rechousa', 'rio tinto', 'vila do conde', 'arcozelo', 'lavra', 'pedrou', 'fanzeres']
};

databases = [
    {
        'name': 'BPIExpressoImobiliario',
        'url': 'http://bpiexpressoimobiliario.pt/{{aim}}/{{type}}/t{{min-rooms}}-t{{max-rooms}}/{{city}}?pricemax={{max-price}}&num=50&image=0&orderby=rel&pricemin={{min-price}}&page={{page}}',
        'base-url': 'http://bpiexpressoimobiliario.pt',
        'page-ready-time': 500,
        'page-start': 1,
        'page-max': 15,
        'page-gap': 1,
        'page-modifiers': {
            'type': { 'flat': 'apartamentos', 'house': '' },
            'aim': { 'rent': 'arrendamento', 'buy': '' }
        },
        'pages-list': '#navigation_links #nvgl_pages a.page_number',
        'list-elements': {
            'el': '#resIni .ohidden.w100percent.cboth.mbot25.mleft10 .fleft.ohidden',
            'title-el': 'h2 .adLink',
            'url-el': 'h2 .adLink',
            'description-el': '.bbotlgray.ptop5.pbot7.mh65 .pleft5',
            'price-el': '.fright.ohidden.mright10 .fright.bold.f12.mtop2'
        },
        'inside-elements': {
            'el': '#imo_detail #imo_description #imo_description_border',
            'description-el': '.bottom_dotted_border h4',
            'img-el': '#big_img'
        }
    },
    {
        'name': 'Trovit',
        'url': 'http://casa.trovit.pt/index.php/cod.search_homes/type.{{aim}}/what_d.{{city}}/page.{{page}}',
        'page-ready-time': 500,
        'page-start': 1,
        'page-max': 15,
        'page-gap': 1,
        'page-modifiers': {
            'type': { 'flat': '', 'house': '' },
            'aim': { 'rent': '2', 'buy': '1' }
        },
        'pages-list': '#wrapper_pager #paginate a',
        'list-elements': {
            'el': '#wrapper_listing .listing .info',
            'title-el': '.leftInfo h4 a',
            'url-el': '.leftInfo h4 a',
            'description-el': '.leftInfo p.description',
            'price-el': '.rightInfo .price'
        },
        'inside-elements': {
            'el': '#show_imovel .show_main_holder',
            'description-el': '#detalhes .textos .descricao',
            'img-el': '#ImgSlide2'
        }
    },
    {
        'name': 'Olx',
        'url': 'http://{{city}}.olx.pt/nf/{{type}}-p-{{page}}/type,{{aim}}',
        'page-ready-time': 500,
        'page-start': 1,
        'page-max': 15,
        'page-gap': 1,
        'page-modifiers': {
            'type': { 'flat': 'apartamento-casa-a-venda-cat-367', 'house': 'casas-moradias-para-arrendar-vender-cat-363' },
            'aim': { 'rent': '2', 'buy': '0' }
        },
        'pages-list': '#div_pagination .page_number a',
        'list-elements': {
            'el': '#resultlist #page.results',
            'title-el': '.ti a',
            'url-el': '.ti a',
            'price-el': '.price',
            'description-el': '.ti a'
        },
        'inside-elements': {
            'el': '#offer-content',
            'description-el': '#description',
            'img-el': '#offer_galery p #objpic',
            'price-el': '#offer_price'
        }
    },
    {
        'name': 'Sapo',
        'url': 'http://casa.sapo.pt/{{aim}}/{{type}}/t{{min-rooms}}-ate-t{{max-rooms}}/?sa=13&lp={{min-price}}&gp={{max-price}}&AOP=1',
        'page-ready-time': 500,
        'page-start': 1,
        'page-max': 15,
        'page-gap': 1,
        'page-modifiers': {
            'type': { 'flat': 'Apartamentos', 'house': 'Moradias' },
            'aim': { 'rent': 'Alugar', 'buy': 'Venda' }
        },
        'pages-list': '.paginador p a',
        'list-elements': {
            'el': '.mainContentBg .propertyList.hlisting',
            'title-el': 'a:first-child .propertyNatLoc h2',
            'url-el': 'a:first-child',
            'price-el': '.propertyDetails span[itemprop=\'price\']',
            'description-el': '.propertyDetails .propertyDescription'
        },
        'inside-elements': {
            'el': '.mainContentBg',
            'description-el': '.detailDescription h2',
            'img-el': '#divPhotos .detailMediaDisplay #ImgSlide2'
        }
    },
    {
        'name': 'Imovirtual',
        'url': 'http://www.imovirtual.com/imoveis/{{type}}/{{aim}}/-/{{city}}/{{city}}/size_from,{{min-rooms}},size_to,{{max-rooms}},price_from,{{min-price}},price_to,{{max-price}},search_page,{{page}}',
        'base-url': 'http://www.imovirtual.com/',
        'page-ready-time': 500,
        'page-start': 0,
        'page-max': 750,
        'page-gap': 14,
        'page-modifiers': {
            'type': { 'flat': 'apartamentos', 'house': '' },
            'aim': { 'rent': 'arrendar', 'buy': '' }
        },
        'pages-list': '.paginate .navmenu a',
        'list-elements': {
            'el': '#content_results #resultlist .new_offer',
            'title-el': '.new_offertitle a',
            'url-el': '.new_offertitle a',
            'description-el': '.new_offerlocation',
            'price-el': '.new_details .details_container .new_price .new_value'
        },
        'inside-elements': {
            'el': '#offer',
            'description-el': '#content-narrow #attributes_visual + div',
            'img-el': '#offer_galery #objpic',
            'price-el': '.list-specs span b'
        }
    }
];

// Returns the data
crawler.search({
    searchCriteria: searchCriteria,
    databases: databases,
    notInside: false
}, function (err, list) {
    // In case there was an error requesting the data
    if (err) {
        return console.log(err);
    }

    // Logs the list object
    var fs = require('fs');
    fs.writeFile('./data-rent-porto.json', JSON.stringify(list, null, 4), function (err) {
        if (err) {
            console.log(err);
        }
    });

    fs.writeFile('./data-rent-porto.js', 'var jsonObject = ' + JSON.stringify(list, null, 4) + ';', function (err) {
        if (err) {
            console.log(err);
        }
    });
});