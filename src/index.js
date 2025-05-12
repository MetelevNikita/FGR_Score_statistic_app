#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { createInterface } = require('readline');
const readline = require("readline");
const fetch = require("node-fetch");
const { json2xml } = require('xml-js');



// 


let gameData

const getOutputPath = (filename, query) => {


    const currentDir = process.cwd();

    console.log(path.join(process.cwd(), filename))

    if (!fs.existsSync(path.join(currentDir + '/' + query))) {
         fs.mkdirSync(path.join(currentDir + '/' + query));

    }

    return path.join(path.join(currentDir + '/' + query), filename);
}



const rl = createInterface(
    {
        input: process.stdin,
        output: process.stdout
    }
);

rl.question('Введите ID игры ', async (query) => {
    console.log(`Запрашиваю данные для игры #${query}`)

    getGame(query).then((data) => {


    setInterval(() => {

        const xml = json2xml(data, {compact: true, spaces: 4});
        const outputPath = getOutputPath(`game-data-id#${query}.xml`, query)
        fs.writeFileSync(outputPath, xml);
        console.log(data)

    }, 1000)


    const logoTeanOne = async (id) => {
    try {
        const response = await fetch(`https://ias.rushandball.ru/api/Media/TeamLogo/${id}`, {
            method: "GET",
            headers: {
                'content-type': 'application/json'
            }
        })

        if(!response.ok){
            return console.log("error in fetching game icon");
        }

        const data = await response.blob()
        const buffer = Buffer.from(await data.arrayBuffer());
        const outputPath = getOutputPath(`team-B-id#${query}.png`, query)
        fs.writeFileSync(outputPath, buffer);

  
    } catch (error) {
        console.log("error in fetching game icon", error);
    }
    }

    const logoTeanTwo = async (id) => {
        try {
            const response = await fetch(`https://ias.rushandball.ru/api/Media/TeamLogo/${id}`, {
                method: "GET",
                headers: {
                    'content-type': 'application/json'
                }
            })

            if(!response.ok){
                return console.log("error in fetching game icon");
            }

            const data = await response.blob()
            const buffer = Buffer.from(await data.arrayBuffer());
            const outputPath = getOutputPath(`team-A-id#${query}.png`, query)
            fs.writeFileSync(outputPath, buffer);

    
        } catch (error) {
            console.log("error in fetching game icon", error);
        }
    }

    // получаем логотипы команды

    logoTeanOne(data.teamA.image)
    logoTeanTwo(data.teamB.image)


})

rl.close()

})






const getGame = async (id) => {
    try {


        const responce = await fetch(`https://ias.rushandball.ru/Api/Online/GetGame/${id}`, {
            method: "GET",
            headers: {
                'contant-type': 'application/json'
            }
        });

        const data = await responce.json()

        gameData = {
            RefereeNameOne: data.Data.Referee1Name,
            RefereeNameTwo: data.Data.Referee2Name,
            teamA: {
                name: data.Data.TeamA.TeamNum,
                shortName : data.Data.TeamA.ShortName,
                score_A: data.Data.TeamA.Score,
                image: data.Data.TeamA.TeamId
            },

            teamB: {
                name: data.Data.TeamB.TeamNum,
                shortName : data.Data.TeamB.ShortName,
                score_B: data.Data.TeamA.Score,
                image: data.Data.TeamB.TeamId
            }
        }
        return gameData;
        
    } catch (error) {
        console.log("error in fetching game", error);
        return [];
    }
}





