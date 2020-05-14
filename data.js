const tabletojson = require('tabletojson').Tabletojson;
const fs = require('fs');

const convertNumb = string => {
    if(!string) return null;
    return parseFloat(string.replace(/\,/g,''));
}
const getCovid = () => {
    return new Promise((resolve, reject) => {
        tabletojson.convertUrl(
            'https://en.wikipedia.org/wiki/COVID-19_pandemic_by_country_and_territory',
            { useFirstRowForHeadings: true },
            function (tablesAsJson) {
                let data = tablesAsJson[1].map(r => {
                    // const keys = Object.keys(r);
                    return {
                        country: cleanCountry(r['Cases[a]']),
                        cases: convertNumb(r['Deaths[c]']),
                        deaths: convertNumb(r['Recov.[d]']),
                        recovered: convertNumb(r['Ref.'])
                    }
                });

                data = data.filter(d=>d.country && !isNaN(d.cases) && d.country.indexOf(',')==-1 )
                resolve(data);
            }
        );
    })
}

const getPop = () => {
    return new Promise((resolve, reject) => {
        tabletojson.convertUrl(
            'https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_population',
            function (tablesAsJson) {
                resolve(tablesAsJson[0].map(r => {
                    const keys = Object.keys(r);
                    return {
                        country: cleanCountry(r['World']),
                        pop: convertNumb(r[keys[2]]),
                        percWorld: convertNumb(r[keys[3]])
                    }
                }))
            }
        );
    });
}

const cleanCountry = (string) =>{
    if(!string) return null;
    string = string.split('[')[0]
    string = string.split(' (')[0]
    string = string.replace(/&/,'and')
    return string;
}

let population, covid;
getPop()
    .then(pop => {
        population = pop;
        let data = JSON.stringify(population);
        fs.writeFileSync('./data/population.json', data);
        return getCovid()
    })
    .then(c => {
        covid = c;
        let data = JSON.stringify(covid);
        fs.writeFileSync('./data/covid.json', data);
    })