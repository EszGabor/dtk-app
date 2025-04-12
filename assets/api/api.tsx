import { View, Text } from 'react-native'
import React, { useState } from 'react'
import image1 from '@/assets/api/apiImages/1.png'
import image2 from '@/assets/api/apiImages/2.jpg'
import image3 from '@/assets/api/apiImages/3.jpg'
import image4 from '@/assets/api/apiImages/4.jpg'

const apiData = [
            {
                "title": "Játékok a mico:bittel",
                "location": "Veszprém",
                "date": "2025. március 21. 08:00 - 2025. március 21. 10:00",
                "shortDesc" : "programozás",
                "description": "A József Attila Általános Iskola 5. évfolyamos tanulói Digitális Kultúra tanóra keretein belül kalandoznak a digitális világban.",
                "image" : image1,
                "agegroup" : "10-12",
                "latitude" : "47.094247",
                "longitude" : "17.906708"
        
            },
            {
                "title": "Biciklis Túra",
                "location": "Szombathely",
                "date": "2025. április 25. 09:00 - 2025. április 25. 12:00",
                "shortDesc" : "sport",
                "description": "A diákok számára szervezett biciklis túra, amely a szabadban való sportolást népszerűsíti.",
                "image": image4,
                "agegroup": "13-14",
                "latitude": "47.237522",
                "longitude": "16.624276"
            },
            {
                "title": "Tudományos Kiállítás",
                "location": "Budapest",
                "date": "2025. április 5. 09:00 - 2025. április 5. 12:00",
                "shortDesc" : "verseny",
                "description": "A diákok bemutatják tudományos projektjeiket, új technológiákat és találmányokat kutatva.",
                "image": image2,
                "agegroup": "15-16",
                "latitude" : "47.521230",
                "longitude" : "19.045619"
            },
            {
                "title": "Művészeti Kiállítás",
                "location": "Győr",
                "date": "2025. április 10. 10:00 - 2025. április 10. 16:00",
                "shortDesc" : "verseny",
                "description": "A diákok művészeti alkotásaik bemutatója, festményektől a digitális tervezésig.",
                "image": image3,
                "agegroup": "17-19",
                "latitude" : "47.681085",
                "longitude" : "17.638070"
            },
            {
                "title": "Digitális Műveltségi Workshop",
                "location": "Veszprém",
                "date": "2025. április 12. 08:00 - 2025. április 12. 10:00",
                "shortDesc" : "nyílt nap",
                "description": "Workshop a diákok számára, hogy biztonságosan navigáljanak a digitális világban.",
                "image": image4,
                "agegroup": "20-25",
                "latitude" : "47.094247",
                "longitude" : "17.906708"
            },
            {
                "title": "Matematika Olimpia",
                "location": "Veszprém",
                "date": "2025. április 15. 11:00 - 2025. április 15. 14:00",
                "shortDesc" : "verseny",
                "description": "Verseny, ahol a diákok bonyolult problémákat oldanak meg és kihívják egymást.",
                "image": image1,
                "agegroup": "25+",
                "latitude" : "47.094247",
                "longitude" : "17.906708"
            },
            {
                "title": "Kódolás Bootcamp",
                "location": "Veszprém",
                "date": "2025. április 18. 09:00 - 2025. április 18. 15:00",
                "shortDesc" : "programozás",
                "description": "Alapvető programozási ismeretek elsajátítása gyakorlati feladatokon keresztül.",
                "image": image2,
                "agegroup": "25+",
                "latitude" : "47.094247",
                "longitude" : "17.906708"
            },
            {
                "title": "Robotika Bemutató",
                "location": "Veszprém",
                "date": "2025. április 20. 10:00 - 2025. április 20. 13:00",
                "shortDesc" : "verseny",
                "description": "A robotok világába kalauzol el bennünket a diákok által tervezett robotok bemutatója.",
                "image": image3,
                "agegroup": "15-16",
                "latitude" : "47.094247",
                "longitude" : "17.906708"
            },
            {
                "title": "Biciklis Túra",
                "location": "Szombathely",
                "date": "2025. április 25. 09:00 - 2025. április 25. 12:00",
                "shortDesc" : "sport",
                "description": "A diákok számára szervezett biciklis túra, amely a szabadban való sportolást népszerűsíti.",
                "image": image1,
                "agegroup": "10-12",
                "latitude": "47.237522",
                "longitude": "16.624276"
            },
            {
                "title": "Futóverseny",
                "location": "Debrecen",
                "date": "2025. április 30. 08:00 - 2025. április 30. 11:00",
                "shortDesc" : "sport",
                "description": "A diákok futóversenyen mérhetik össze erejüket, a legjobb teljesítményeket díjazzák.",
                "image": image2,
                "agegroup": "13-14",
                "latitude" : "47.530176",
                "longitude" : "21.624743"
            },
            {
                "title": "Kézilabda Torna",
                "location": "Pécs",
                "date": "2025. május 5. 10:00 - 2025. május 5. 15:00",
                "shortDesc" : "sport",
                "description": "A csapatok versenyeznek egy izgalmas kézilabda tornán, ahol a legügyesebb csapatokat díjazzák.",
                "image": image3,
                "agegroup": "13-14",
                "latitude" : "46.074446",
                "longitude" : "18.235334"
            },
            {
                "title": "Szabadidős Sportnap",
                "location": "Székesfehérvár",
                "date": "2025. május 10. 09:00 - 2025. május 10. 13:00",
                "shortDesc" : "sport",
                "description": "Sportos programokkal teli nap a szabadidő aktív eltöltésére, különféle sportágak kipróbálásával.",
                "image": image4,
                "agegroup": "10-12",
                "latitude" : "47.187726",
                "longitude" : "18.428042"
            },
            {
                "title": "Képzőművészeti Kiállítás",
                "location": "Budapest",
                "date": "2025. április 15. 10:00 - 2025. április 15. 14:00",
                "shortDesc" : "látnivalók",
                "description": "A kiállításon a diákok művészeti alkotásait láthatjuk, festményektől a szobrászatig.",
                "image": image1,
                "agegroup": "20-25",
                "latitude" : "47.521230",
                "longitude" : "19.045619"
            },
            {
                "title": "Látnivalók Túravezetés",
                "location": "Esztergom",
                "date": "2025. április 18. 10:00 - 2025. április 18. 13:00",
                "shortDesc" : "látnivalók",
                "description": "Túravezetés a város történelmi nevezetességeiben, megismerhetjük Esztergom kulturális örökségét.",
                "image": image2,
                "agegroup": "15-16",
                "latitude" : "47.792240",
                "longitude" : "18.734073"
            },
            {
                "title": "Vár Túra",
                "location": "Visegrád",
                "date": "2025. április 20. 11:00 - 2025. április 20. 14:00",
                "shortDesc" : "látnivalók",
                "description": "Felfedezésre hívjuk a diákokat a híres visegrádi várban, mely a magyar történelem fontos helyszíne.",
                "image": image3,
                "agegroup": "15-16",
                "latitude" : "47.784480",
                "longitude" : "18.971713"
            },
            {
                "title": "Fesztivál Élményei",
                "location": "Pécs",
                "date": "2025. május 3. 14:00 - 2025. május 3. 18:00",
                "shortDesc" : "látnivalók",
                "description": "A diákok megismerhetik a város kulturális életét, többféle művészeti előadáson vehetnek részt.",
                "image": image4,
                "agegroup": "10-12",
                "latitude" : "46.074446",
                "longitude" : "18.235334"
            },
            {
                "title": "Történelmi Séta",
                "location": "Szeged",
                "date": "2025. április 22. 10:00 - 2025. április 22. 13:00",
                "shortDesc" : "látnivalók",
                "description": "A séta során a diákok megismerhetik Szeged városának történelmét és építészeti különlegességeit.",
                "image": image1,
                "agegroup": "13-14",
                "latitude" : "46.249266",
                "longitude" : "20.151537"
            }
            
        ]

export default apiData