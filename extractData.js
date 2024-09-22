const axios = require('axios');

const attractions = [
    //דובאי
    {
        "productId": "1000",
        "city": "דובאי",
        "category": "מגדלים ותצפיות",
        "attractionName": "בורג' חליפה",
        "ticketTypes": [
            { "type": "מבוגר", "price": 185.00 },
            { "type": "ילד", "price": 149.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "1001",
        "city": "דובאי",
        "category": "מגדלים ותצפיות",
        "attractionName": "מסגרת דובאי",
        "ticketTypes": [
            { "type": "מבוגר", "price": 49.00 },
            { "type": "ילד", "price": 29.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "1002",
        "city": "דובאי",
        "category": "מגדלים ותצפיות",
        "attractionName": "תצפית אי הדקלים",
        "ticketTypes": [
            { "type": "מבוגר", "price": 95.00 },
            { "type": "ילד", "price": 69.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "1003",
        "city": "דובאי",
        "category": "מגדלים ותצפיות",
        "attractionName": "תצפית ומגלשת הסקיי ויו ",
        "ticketTypes": [
            { "type": "מבוגר", "price": 95.00 },
            { "type": "ילד", "price": 79.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "1004",
        "city": "דובאי",
        "category": "פארקים וגנים",
        "attractionName": "גן הפרחים",
        "ticketTypes": [
            { "type": "מבוגר", "price": 89.00 },
            { "type": "ילד", "price": 79.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "1005",
        "city": "דובאי",
        "category": "פארקים וגנים",
        "attractionName": "הכפר הגלובלי",
        "ticketTypes": [
            { "type": "מבוגר", "price": 22.00 },
            { "type": "ילד", "price": 22.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "1006",
        "city": "דובאי",
        "category": "פארקים וגנים",
        "attractionName": "אקווריום דובאי",
        "ticketTypes": [
            { "type": "מבוגר", "price": 179.00 },
            { "type": "ילד", "price": 85.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "1007",
        "city": "דובאי",
        "category": "פארקים וגנים",
        "attractionName": "פארק המים אטלנטיס",
        "ticketTypes": [
            { "type": "מבוגר", "price": 309.00 },
            { "type": "ילד", "price": 269.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "1008",
        "city": "דובאי",
        "category": "סיורים ושייט",
        "attractionName": "שייט בלוטוס",
        "ticketTypes": [
            { "type": "מבוגר", "price": 279.00 },
            { "type": "ילד", "price": 229.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "1009",
        "city": "דובאי",
        "category": "סיורים ושייט",
        "attractionName": "חצי יום סיור",
        "ticketTypes": [
            { "type": "מבוגר", "price": 75.00 },
            { "type": "ילד", "price": 75.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "1010",
        "city": "דובאי",
        "category": "סיורים ושייט",
        "attractionName": "סירות צהובות",
        "ticketTypes": [
            { "type": "מבוגר", "price": 145.00 },
            { "type": "ילד", "price": 145.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "1011",
        "city": "דובאי",
        "category": "סיורים ושייט",
        "attractionName": "שייט מקוצר לגלגל ענק",
        "ticketTypes": [
            { "type": "מבוגר", "price": 85.00 },
            { "type": "ילד", "price": 85.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "1012",
        "city": "דובאי",
        "category": "מוזיאונים",
        "attractionName": "מוזיאון העתיד",
        "ticketTypes": [
            { "type": "מבוגר", "price": 149.00 },
            { "type": "ילד", "price": 129.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "1013",
        "city": "דובאי",
        "category": "מוזיאונים",
        "attractionName": "הגלקסיה של איה",
        "ticketTypes": [
            { "type": "מבוגר", "price": 109.00 },
            { "type": "ילד", "price": 109.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "1014",
        "city": "דובאי",
        "category": "מוזיאונים",
        "attractionName": "מוזיאון האשליות בדובאי",
        "ticketTypes": [
            { "type": "מבוגר", "price": 85.00 },
            { "type": "ילד", "price": 59.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "1015",
        "city": "דובאי",
        "category": "מוזיאונים",
        "attractionName": "אייס בר דובאי",
        "ticketTypes": [
            { "type": "מבוגר", "price": 79.00 },
            { "type": "ילד", "price": 65.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },
    //פריז
    {
        "productId": "2000",
        "city": "פריז",
        "category": "מגדלים ותצפיות",
        "attractionName": "מגדל האייפל",
        "ticketTypes": [
            { "type": "מבוגר", "price": 225.00 },
            { "type": "ילד", "price": 121.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "2001",
        "city": "פריז",
        "category": "מגדלים ותצפיות",
        "attractionName": "שער הניצחון",
        "ticketTypes": [
            { "type": "מבוגר", "price": 50.00 },
            { "type": "ילד", "price": 31.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "2002",
        "city": "פריז",
        "category": "מגדלים ותצפיות",
        "attractionName": "הפנתאון של פריז",
        "ticketTypes": [
            { "type": "מבוגר", "price": 51.00 },
            { "type": "ילד", "price": 32.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "2003",
        "city": "פריז",
        "category": "מגדלים ותצפיות",
        "attractionName": "מגדל מונפרנאס",
        "ticketTypes": [
            { "type": "מבוגר", "price": 95.00 },
            { "type": "ילד", "price": 79.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "2004",
        "city": "פריז",
        "category": "מוזיאונים",
        "attractionName": "מוזיאון השעווה",
        "ticketTypes": [
            { "type": "מבוגר", "price": 150.00 },
            { "type": "ילד", "price": 97.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "2005",
        "city": "פריז",
        "category": "מוזיאונים",
        "attractionName": "מוזיאון הלובר",
        "ticketTypes": [
            { "type": "מבוגר", "price": 270.00 },
            { "type": "ילד", "price": 234.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "2006",
        "city": "פריז",
        "category": "מוזיאונים",
        "attractionName": "מוזיאון השוקולד",
        "ticketTypes": [
            { "type": "מבוגר", "price": 40.00 },
            { "type": "ילד", "price": 16.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "2007",
        "city": "פריז",
        "category": "מוזיאונים",
        "attractionName": "מוזיאון האורות",
        "ticketTypes": [
            { "type": "מבוגר", "price": 84.00 },
            { "type": "ילד", "price": 64.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "2008",
        "city": "פריז",
        "category": "פארקים וגנים",
        "attractionName": "פארק אסטריקס",
        "ticketTypes": [
            { "type": "מבוגר", "price": 200.00 },
            { "type": "ילד", "price": 187.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "2009",
        "city": "פריז",
        "category": "פארקים וגנים",
        "attractionName": "פארק המים אקווה בולוורד",
        "ticketTypes": [
            { "type": "מבוגר", "price": 100.00 },
            { "type": "ילד", "price": 78.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "2010",
        "city": "פריז",
        "category": "פארקים וגנים",
        "attractionName": "ארמון ורסאי",
        "ticketTypes": [
            { "type": "מבוגר", "price": 150.00 },
            { "type": "ילד", "price": 94.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "2011",
        "city": "פריז",
        "category": "פארקים וגנים",
        "attractionName": "פארק דה פראנס",
        "ticketTypes": [
            { "type": "מבוגר", "price": 140.00 },
            { "type": "ילד", "price": 59.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "2012",
        "city": "פריז",
        "category": "אטרקציות ייחודיות",
        "attractionName": "דיסנילנד",
        "ticketTypes": [
            { "type": "מבוגר", "price": 275.00 },
            { "type": "ילד", "price": 195.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "2013",
        "city": "פריז",
        "category": "אטרקציות ייחודיות",
        "attractionName": "האקווריום של פריז",
        "ticketTypes": [
            { "type": "מבוגר", "price": 150.00 },
            { "type": "ילד", "price": 97.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "2014",
        "city": "פריז",
        "category": "אטרקציות ייחודיות",
        "attractionName": "שייט על הסיין",
        "ticketTypes": [
            { "type": "מבוגר", "price": 90.00 },
            { "type": "ילד", "price": 58.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "2015",
        "city": "פריז",
        "category": "אטרקציות ייחודיות",
        "attractionName": "האופרה גרנייה",
        "ticketTypes": [
            { "type": "מבוגר", "price": 95.00 },
            { "type": "ילד", "price": 47.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },
    //רומא
    {
        "productId": "3000",
        "city": "רומא",
        "category": "מגדלים ותצפיות",
        "attractionName": "גבעת ג'אניקולו",
        "ticketTypes": [
            { "type": "מבוגר", "price": 45.00 },
            { "type": "ילד", "price": 20.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "3001",
        "city": "רומא",
        "category": "מגדלים ותצפיות",
        "attractionName": "טירת סנטאנג'לו",
        "ticketTypes": [
            { "type": "מבוגר", "price": 80.00 },
            { "type": "ילד", "price": 59.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "3002",
        "city": "רומא",
        "category": "מגדלים ותצפיות",
        "attractionName": "מגדל פיזה",
        "ticketTypes": [
            { "type": "מבוגר", "price": 120.00 },
            { "type": "ילד", "price": 79.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "3003",
        "city": "רומא",
        "category": "פארקים וגנים",
        "attractionName": "תצפית מכנסיית פטרוס הקדוש",
        "ticketTypes": [
            { "type": "מבוגר", "price": 95.00 },
            { "type": "ילד", "price": 79.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "3004",
        "city": "רומא",
        "category": "פארקים וגנים",
        "attractionName": "גני וילה בורגזהב",
        "ticketTypes": [
            { "type": "מבוגר", "price": 20.00 },
            { "type": "ילד", "price": 18.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "3005",
        "city": "רומא",
        "category": "פארקים וגנים",
        "attractionName": "גן התפוזים",
        "ticketTypes": [
            { "type": "מבוגר", "price": 20.00 },
            { "type": "ילד", "price": 15.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "3006",
        "city": "רומא",
        "category": "פארקים וגנים",
        "attractionName": "פארק מגיקלאנד",
        "ticketTypes": [
            { "type": "מבוגר", "price": 80.00 },
            { "type": "ילד", "price": 79.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "3007",
        "city": "רומא",
        "category": "פארקים וגנים",
        "attractionName": "פארק וילה אדה",
        "ticketTypes": [
            { "type": "מבוגר", "price": 82.00 },
            { "type": "ילד", "price": 25.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "3008",
        "city": "רומא",
        "category": "אטרקציות יחודיות",
        "attractionName": "הקולוסיאום",
        "ticketTypes": [
            { "type": "מבוגר", "price": 85.00 },
            { "type": "ילד", "price": 81.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "3009",
        "city": "רומא",
        "category": "אטרקציות יחודיות",
        "attractionName": "בית הכנסת הגדול ברומא",
        "ticketTypes": [
            { "type": "מבוגר", "price": 55.00 },
            { "type": "ילד", "price": 44.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "3010",
        "city": "רומא",
        "category": "אטרקציות יחודיות",
        "attractionName": "מזרקת טרווי",
        "ticketTypes": [
            { "type": "מבוגר", "price": 70.00 },
            { "type": "ילד", "price": 48.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "3011",
        "city": "רומא",
        "category": "אטרקציות יחודיות",
        "attractionName": "ביופארקו",
        "ticketTypes": [
            { "type": "מבוגר", "price": 70.00 },
            { "type": "ילד", "price": 68.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "3012",
        "city": "רומא",
        "category": "מוזיאונים",
        "attractionName": "מוזיאון הוותיקן",
        "ticketTypes": [
            { "type": "מבוגר", "price": 81.00 },
            { "type": "ילד", "price": 79.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "3013",
        "city": "רומא",
        "category": "מוזיאונים",
        "attractionName": "גלרייה בורגזה",
        "ticketTypes": [
            { "type": "מבוגר", "price": 60.00 },
            { "type": "ילד", "price": 52.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "3014",
        "city": "רומא",
        "category": "מוזיאונים",
        "attractionName": "מוזיאון ארה פאצ'יס",
        "ticketTypes": [
            { "type": "מבוגר", "price": 52.00 },
            { "type": "ילד", "price": 48.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "3015",
        "city": "רומא",
        "category": "מוזיאונים",
        "attractionName": "המוזיאון הלאומי האטרוסקי",
        "ticketTypes": [
            { "type": "מבוגר", "price": 52.00 },
            { "type": "ילד", "price": 48.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },
    //לונדון
    {
        "productId": "4003",
        "city": "לונדון",
        "category": "מגדלים ותצפיות",
        "attractionName": "מצודת לונדון",
        "ticketTypes": [
            { "type": "מבוגר", "price": 80.00},
            { "type": "ילד", "price": 40.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "4002",
        "city": "לונדון",
        "category": "מגדלים ותצפיות",
        "attractionName": "תצפית 360 בלונדון",
        "ticketTypes": [
            { "type": "מבוגר", "price": 120.00 },
            { "type": "ילד", "price": 60.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "4001",
        "city": "לונדון",
        "category": "מגדלים ותצפיות",
        "attractionName": "הביג בן בלונדון",
        "ticketTypes": [
            { "type": "מבוגר", "price": 79.00},
            { "type": "ילד", "price": 32.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "4000",
        "city": "לונדון",
        "category": "מגדלים ותצפיות",
        "attractionName": "גשר המגדל",
        "ticketTypes": [
            { "type": "מבוגר", "price": 48.00 },
            { "type": "ילד", "price": 24.00},
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "4004",
        "city": "לונדון",
        "category": "פארקים וגנים",
        "attractionName": "הייד פארק",
        "ticketTypes": [
            { "type": "מבוגר", "price": 70.00},
            { "type": "ילד", "price": 40.00},
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "4005",
        "city": "לונדון",
        "category": "פארקים וגנים",
        "attractionName": "סנט גיימס פארק",
        "ticketTypes": [
            { "type": "מבוגר", "price": 80.00},
            { "type": "ילד", "price": 80.00},
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "4006",
        "city": "לונדון",
        "category": "פארקים וגנים",
        "attractionName": "גני קנסינגטון",
        "ticketTypes": [
            { "type": "מבוגר", "price": 22.00 },
            { "type": "ילד", "price": 22.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "4007",
        "city": "לונדון",
        "category": "פארקים וגנים",
        "attractionName": "הפארק הירוק",
        "ticketTypes": [
            { "type": "מבוגר", "price": 25.00 },
            { "type": "ילד", "price": 15.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "4008",
        "city": "לונדון",
        "category": "סיורים והופעות",
        "attractionName": "ארמון בקינגהאם",
        "ticketTypes": [
            { "type": "מבוגר", "price": 74.00 },
            { "type": "ילד", "price": 64.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "4009",
        "city": "לונדון",
        "category": "סיורים והופעות",
        "attractionName": "יצירת הארי פוטר ",
        "ticketTypes": [
            { "type": "מבוגר", "price": 320.00},
            { "type": "ילד", "price": 320.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "4010",
        "city": "לונדון",
        "category": "סיורים והופעות",
        "attractionName": "סיור גק המרטש",
        "ticketTypes": [
            { "type": "מבוגר", "price": 54.00 },
            { "type": "ילד", "price": 0.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "4011",
        "city": "לונדון",
        "category": "סיורים והופעות",
        "attractionName": "מחזמר מלך האריות",
        "ticketTypes": [
            { "type": "מבוגר", "price": 100.00 },
            { "type": "ילד", "price": 50.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "4012",
        "city": "לונדון",
        "category": "מוזיאונים",
        "attractionName": "גלריית וואלאס",
        "ticketTypes": [
            { "type": "מבוגר", "price": 20.00},
            { "type": "ילד", "price": 0.00},
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "4013",
        "city": "לונדון",
        "category": "מוזיאונים",
        "attractionName": "מוזיאון ויקטוריה ואלברט",
        "ticketTypes": [
            { "type": "מבוגר", "price": 35.00 },
            { "type": "ילד", "price": 0.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "4014",
        "city": "לונדון",
        "category": "מוזיאונים",
        "attractionName": "הגלריה הלאומית",
        "ticketTypes": [
            { "type": "מבוגר", "price": 40.00 },
            { "type": "ילד", "price": 40.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    },{
        "productId": "4015",
        "city": "לונדון",
        "category": "מוזיאונים",
        "attractionName": "המוזיאון הבריטי",
        "ticketTypes": [
            { "type": "מבוגר", "price": 55.00 },
            { "type": "ילד", "price": 55.00 },
            { "type": "תינוק", "price": 0.00 }
        ]
    }
];

// שליחת כל אטרקציה לשרת עם בדיקה אם האטרקציה כבר קיימת
attractions.forEach(attraction => {
    axios.get(`http://localhost:2001/get-attractions`)
.then(response => {
    const existingAttraction = response.data.find(a => a.productId === attraction.productId);
    if (existingAttraction) {
        console.log(`Attraction ${attraction.productId} already exists, skipping.`);
    } else {
        axios.post('http://localhost:2001/add-attraction', attraction)
        .then(response => console.log(`Attraction ${attraction.productId} added successfully.`))
        .catch(error => console.error(`Error adding attraction ${attraction.productId}:`, error.response ? error.response.data : error.message));
    }
})
.catch(error => console.error(`Error retrieving attractions:`, error));
});
