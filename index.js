const STORE = {
    population: [],
    covid: [],
    data: []
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
                    STORE.data.push({
                        ...c,
                        ...pop[c.country]
                    });
                } else {
                    console.warn('Countr not found: ', c.country)
                }
            })

            start()
        });

    });
}

const start = () => {

    populateTable();
    console.log(STORE)
}
const populateTable = () => {
    var items = [];

    $.each(STORE.data, function (key, val) {
        items.push(`
        <tr>
            <td>${val.country}</td>
            <td>${numFormat(val.cases)}</td>
            <td>${numFormat(val.deaths)}</td>
            <td>${numFormat(val.recovered)}</td>
            <td>${numFormat(val.pop)}</td>
            <td>${val.percWorld}</td>
            <td>${val.deaths ? parseInt(val.pop / val.deaths).toLocaleString() : 0}</td>
            <td>${val.percWorld ? val.deaths / val.percWorld : 0}</td>
        </tr>
        
        `);
    });
    console.log(items)
    $("#data tbody").html(items.join(''));
}

const numFormat = n =>{
    if(!n) return null;
    return n.toLocaleString();
}

const main = () => {
    data();
}
$(main)