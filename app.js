import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import axios from "axios";


const url = "https://restcountries.com/v3.1/";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan(`dev`))

// Homepage

app.get("/", async (req, res) => {
  try {

      //get API

    const response = await axios.get(`${url}all?fields=name`);

      // Render to front

    res.render('index.ejs', {data: response.data});
  } catch (error) {
    console.error(error.message);
    res.render('index.ejs', {data: error.message})
  }
})







// Create route for specific country

app.get("/country", async (req, res) => {

    // Get user input from anchor link

  const countryName = req.query.name;
  try {

      // Search input

    const response = await axios.get(`${url}name/${countryName}`);

    // Render input country to front

    res.render("index.ejs", {countryData: response.data});
  } catch (error) {
    console.error(error.message);
    res.render('index.ejs', {data: error.message});
  }
})







// Create route for chart options

app.get("/countries", async (req, res) => {
  try {
    res.render("index.ejs", {countriesMain: "Choose a chart"});
  } catch (error) {
    console.error(`Failed to make request:`, error.message);
    res.render(`index.ejs`, {data: error.message})
  };
});

      






// Create route for selected chart option

app.post("/countries/charts", async (req, res) => {
  try {
    // Get user input from the selection
    const chartField = req.body.fields;
    console.log(chartField)
          
        // Define which selection


        // If Regions
          
    if (chartField == "Region") {


      const chartsText = {
        headline: `Countries in ${chartField}`,
        legend: `Amount of countries in ${chartField}`,
      };

      // get API
      const response = await axios.get(url + `all`);
         
      // Store data in an array

      const regionDataArray = [];
          response.data.forEach(element => { 
            regionDataArray.push(element.region);
          });
          
          // Count the repeating values
          
          const regionsCount = regionDataArray.reduce((regions, count) => {
            regions[count] = (regions[count] || 0) + 1;
            return regions
          }, {});


          // Sort

          const regionSorted = Object.fromEntries(Object.entries(regionsCount).sort(([, a], [, b]) => b - a))


          // Retrieve values, keys and calculate percentage create output

          const outputRegCount = Object.values(regionSorted);
          const outputReg = Object.keys(regionSorted);
          const outputRegPercentage = outputRegCount.map((value) => Number.parseFloat((value / outputRegCount[0]) * 100).toFixed(2));

          
          // Render data to front
          
          res.render("index.ejs", {chartsData: outputRegCount, chartsNames: outputReg, chartsPercentage: outputRegPercentage, chartsText,})
        
        
        
        // if Currencies
        
        
        } else if (chartField == "Currencies") {

          const chartsText = {
            headline: chartField,
            legend: `Used by countries`,
          };
          
          // get API

          const response = await axios.get(url + `all`);
          
          // store data in an array
          
          const currenciesDataArray = [];
          response.data.forEach(element => { 
            currenciesDataArray.push(element.currencies);
          });
          
          // remove invalid values
          
          currenciesDataArray.forEach(element => {
            if ( element == null || undefined) {
              let index = currenciesDataArray.indexOf(element);
              currenciesDataArray.splice(index, 1);
            };
          });
          
         // filter out the symbols
          
         const currencySymbol = [];

          for ( let i = 0; i < currenciesDataArray.length; i++) {
            const [currencyObject] = Object.values(currenciesDataArray[i]);
            currencySymbol.push(currencyObject.symbol);
          }
          
          // Count repeating symbols
          
          const currencySymbolCount = currencySymbol.reduce((symbols, count) => {
            symbols[count] = (symbols[count] || 0) + 1;
            return symbols
          }, {});
          // Sort
          const currencySymbolCountSorted = Object.fromEntries(Object.entries(currencySymbolCount).sort(([, a], [, b]) => b - a))
          
          //Retrieve values, keys, calculate percentage and create output  
        
          const outputSymbCount = Object.values(currencySymbolCountSorted).slice(0, 10);
          const outputSymb = Object.keys(currencySymbolCountSorted).slice(0, 10);
          const outputSymbPercentage = outputSymbCount.map((value) => Number.parseFloat((value / outputSymbCount[0]) * 100).toFixed(2));
          
          ////// Render
          res.render("index.ejs", {chartsData: outputSymbCount, chartsPercentage: outputSymbPercentage, chartsNames: outputSymb, chartsText})
        }

        
    
  } catch (error) {
    console.error(`Failed to make request:`, error.message);
    res.render(`index.ejs`, {data: error.message})
  }
})




app.listen(port, () => {
  console.log(port)
})