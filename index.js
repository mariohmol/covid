const STORE = {
    population: [],
    covid: [],
    data: [],
    sorted: [],
    sort: 'deathPerMillion',
    sortType: -1,
    top: 50
}
const data = () => {
    $.getJSON("data/population.json", function (data) {
        STORE.population = data;

        $.getJSON("data/covid.json", function (data) {
            STORE.covid = data;
            const pop = {};
            STORE.population.forEach(p => {
                pop[p.country] = p
            })

            STORE.covid.forEach(c => {
                if (pop[c.country]) {
                    const newobj = {
                        ...c,
                        ...pop[c.country]
                    }
                    if (newobj.deaths) {
                        newobj.deathPop = parseInt(newobj.pop / newobj.deaths);
                        newobj.deathPerMillion = parseInt(newobj.deaths / (newobj.pop / 1000000));
                        newobj.deathPercWorld = newobj.percWorld ? newobj.deaths / newobj.percWorld : 0;
                    } else {
                        newobj.deathPop = 0;
                        newobj.deathPerMillion = 0;
                        newobj.deathPercWorld = 0;
                    }

                    STORE.data.push(newobj);
                } else {
                    console.warn('Countr not found: ', c.country)
                }
            })

            start()
        });

    });
}

const start = () => {
    render();
    console.log(STORE)
}

const render = () => {
    populateTable(true);
    populateTable(false);
    makeBar();
}
const populateTable = (deaths = true) => {
    var items = [];
    STORE.sorted = STORE.data.sort((a, b) => a[STORE.sort] > b[STORE.sort] ? STORE.sortType : STORE.sortType * -1);
    let count = 0;
    $.each(STORE.sorted, function (key, val) {
        if (deaths && (!val[STORE.sort] || val[STORE.sort] < 2)) {
            return
        } else if (!deaths && val[STORE.sort]) {
            return;
        }
        count++;
        items.push(`
        <tr>
            <td>${count}</td>
            <td>${val.country}</td>
            <td>${numFormat(val.cases)}</td>
            <td>${numFormat(val.deaths)}</td>
            <td>${numFormat(val.recovered)}</td>
            <td>${numFormat(val.pop)}</td>
            <td>${val.percWorld}</td>
            <td>${numFormat(val.deathPerMillion)}</td>
            <td>${val.deathPercWorld}</td>
        </tr>
        
        `);
    });
    if (deaths) {
        $("#data tbody").html(items.join(''));
    } else {
        $("#datano tbody").html(items.join(''));
    }

}

const numFormat = n => {
    if (!n) return null;
    return n.toLocaleString();
}

const main = () => {
    startLayout()
    listeners();
    data();
}
const listeners = () => {
    $('body').on('click', '#dataheader td', e => {
        const sort = $(e.target).data("id");
        if (sort === STORE.sort) {
            STORE.sortType *= -1;
        } else {
            STORE.sort = sort;
        }
        render();
    });

    $('body').on('change', '#changelimit', e => {
        const val = e.target.value;
        STORE.limit = val;
        render();
    });


}

const startLayout = () => {

    document.addEventListener('DOMContentLoaded', function () {
        var elems = document.querySelectorAll('.tooltipped');
        var instances = M.Tooltip.init(elems, options);
    });

    $('.tooltipped').tooltip();

    document.addEventListener('DOMContentLoaded', function () {
        var elems = document.querySelectorAll('.dropdown-trigger');
        var instances = M.Dropdown.init(elems, options);
    });

    // Or with jQuery

    $('.dropdown-trigger').dropdown();
    $('select').formSelect();

}
$(main)