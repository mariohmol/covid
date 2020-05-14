const makeBar = () => {

    const data  = STORE.sorted;
    const labels = [];
    const values= [];

    for(i=0;i<STORE.limit;i++){
        labels.push(data[i].country);
        values.push(data[i][STORE.sort]);
    }
    // var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var color = Chart.helpers.color;
    var barChartData = {
        labels: labels,
        datasets: [{
            label: 'Country by ' + STORE.sort,
            backgroundColor: color('red').alpha(0.5).rgbString(),
            borderColor: 'red',
            borderWidth: 1,
            data: values
        }
        // , {
        //     label: 'Dataset 2',
        //     backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
        //     borderColor: window.chartColors.blue,
        //     borderWidth: 1,
        //     data: [
        //         randomScalingFactor(),
        //         randomScalingFactor(),
        //         randomScalingFactor(),
        //         randomScalingFactor(),
        //         randomScalingFactor(),
        //         randomScalingFactor(),
        //         randomScalingFactor()
        //     ]
        // }
    ]

    };


    if(window.myBar){
        myBar.data = barChartData;
        myBar.update();
    }else{
        var ctx = document.getElementById('canvas').getContext('2d');
        window.myBar = new Chart(ctx, {
            type: 'bar',
            data: barChartData,
            options: {
                responsive: true,
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: ''
                }
            }
        });
    }
    

}