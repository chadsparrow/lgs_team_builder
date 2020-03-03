const mongoose = require('mongoose');
const { CatalogItem } = require('../../models/CatalogItem');
const fs = require('fs');
const XLSX = require('xlsx');

const dothething = async function() {
  try {
    // connects to mongodb
    await mongoose.connect(
      'mongodb://teambuilder:aGzEvUovDM6Yuo7RL@localhost:27018/teambuilder-dev?authSource=admin',
      {
        useNewUrlParser: true,
        autoReconnect: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true
      }
    );
    console.log('Connected to MongoDB..');

    await CatalogItem.deleteMany({
      catalogId: mongoose.Types.ObjectId('5dee9f00bb12ff0028ceff63')
    });

    const wb = XLSX.readFile('./garneau_catalog_list_2020.xlsx');
    const sheetName = wb.SheetNames[0];
    const workSheet = wb.Sheets[sheetName];
    const workSheetJSON = XLSX.utils.sheet_to_json(workSheet);
    const workSheetLength = workSheetJSON.length;

    for (i = 0; i < workSheetLength; i++) {
      let nameEN = workSheetJSON[i].name
        .replace("W'S", "WOMEN'S")
        .replace('GROOM', 'GROM')
        .replace('JR', 'JUNIOR')
        .replace('TUQUE', 'TOQUE')
        .replace('FEMME', '');

      if (nameEN.includes(' MEN') && !nameEN.includes("MEN'S")) {
        nameEN = "MEN'S " + nameEN.replace(' MEN', '');
      }

      if (nameEN.includes(' WOMEN') && !nameEN.includes("WOMEN'S")) {
        nameEN = "WOMEN'S " + nameEN.replace(' WOMEN', '');
      }

      let nameFR = workSheetJSON[i].nom;
      let gender;
      if (workSheetJSON[i].gender === 'MEN') {
        gender = 'M';
      } else if (workSheetJSON[i].gender === 'WOMEN') {
        gender = 'F';
      } else if (workSheetJSON[i].gender === 'UNISEX') {
        gender = 'U';
      } else if (workSheetJSON[i].gender === 'JUNIOR') {
        gender = 'J';
      }

      const descriptionEN = workSheetJSON[i]['description Anglais']
        ? workSheetJSON[i]['description Anglais'].replace('FEMME', '')
        : 'NA';
      const descriptionFR = workSheetJSON[i]['description Français']
        ? workSheetJSON[i]['description Français']
        : 'NA';
      const categories = workSheetJSON[i].category ? workSheetJSON[i].category.split(' ') : [];
      const categoriesFR = workSheetJSON[i]['catégorie']
        ? workSheetJSON[i]['catégorie'].split(' ')
        : [];

      const productCode = workSheetJSON[i].productCode;
      const styleCode = workSheetJSON[i].styleCode;

      const sizes = workSheetJSON[i].sizes.split(',');

      const fixedSizes = sizes.map(size => {
        size = size.replace('OS', 'ONE');
        size = size.replace('Jr', '');

        return size;
      });

      const newItem = {
        catalogId: mongoose.Types.ObjectId('5dee9f00bb12ff0028ceff63'),
        nameEN,
        nameFR,
        gender,
        descriptionEN,
        descriptionFR,
        categories,
        categoriesFR,
        productCode,
        styleCode,
        sizes: fixedSizes,
        priceBreaks: {
          CAD: [
            {
              priceBreak: '1',
              price: 0
            },
            {
              priceBreak: '2-5',
              price: 0
            },
            {
              priceBreak: '6-11',
              price: 0
            },
            {
              priceBreak: '12-49',
              price: 0
            },
            {
              priceBreak: '50-99',
              price: 0
            },
            {
              priceBreak: '100-249',
              price: 0
            }
          ],
          USD: [
            {
              priceBreak: '1',
              price: 0
            },
            {
              priceBreak: '2-5',
              price: 0
            },
            {
              priceBreak: '6-11',
              price: 0
            },
            {
              priceBreak: '12-49',
              price: 0
            },
            {
              priceBreak: '50-99',
              price: 0
            },
            {
              priceBreak: '100-249',
              price: 0
            }
          ]
        },
        images: []
      };

      await CatalogItem.create(newItem);
    }

    // items.forEach(async item => {
    //   const itemNameEN = item.nameEN.replace('’', "'");
    //   // const fileName1 = `${item.styleCode}_front`;
    //   // const fileName2 = `${item.styleCode}_back`;

    //   await CatalogItem.updateOne({ _id: item._id }, { $set: { nameEN: itemNameEN } });
    // });

    console.log('Seeder Complete');
    // disconnects from mongodb
    // await mongoose.disconnect();
    // console.log('Disconnected from MongoDB..');
  } catch (err) {
    console.log(err);
  }
};

dothething();
