let tasbihBtn = document.querySelector('.tasbihBtn');
let clearBtn = document.querySelector('.clearBtn');
let countBtn = document.querySelector('.countBtn');
let select1 = document.getElementById('select1');
let select2 = document.getElementById('select2');
let select3 = document.getElementById('select3');
let select4 = document.getElementById('select4');
let select5 = document.getElementById('select5');
let tasbihTxt = document.getElementById('tasbihTxt');
let tasbihDes = document.getElementById('tasbihDes');
let timeNow = document.getElementById('timeNow');
let prayTimeFajr = document.getElementById('prayTimeFajr');
let prayTimeSunrise = document.getElementById('prayTimeSunrise');
let prayTimeDhuhr = document.getElementById('prayTimeDhuhr');
let prayTimeAsr = document.getElementById('prayTimeAsr');
let prayTimeMaghrib = document.getElementById('prayTimeMaghrib');
let prayTimeIsha = document.getElementById('prayTimeIsha');
let dateH = document.getElementById('dateH');
let dateM = document.getElementById('dateM');

let count = 1;

tasbihBtn.addEventListener('click', () => {
    countBtn.innerHTML = count;
    count++;
});

clearBtn.addEventListener('click', () => {
    countBtn.innerHTML = 0;
    count = 1;
});

let selections = [
    { element: select1, text: 'Astaghfirullah', color: 'rgba(255,255,255,1)', txtDec: 'I seek forgiveness from Allah for my sins and shortcomings.' },
    { element: select2, text: 'Subhan Allah', color: 'rgba(255,255,255,1)', txtDec: 'Glory be to Allah, free from any imperfection or flaw.' },
    { element: select3, text: 'Alhamdulillah', color: 'rgba(255,255,255,1)', txtDec: 'All praise is due to Allah for His blessings and mercy.' },
    { element: select4, text: 'La ilaha illallah', color: 'rgba(255,255,255,1)', txtDec: 'There is no god but Allah, the one worthy of worship.' },
    { element: select5, text: 'Allahu Akbar', color: 'rgba(255,255,255,1)', txtDec: 'Allah is the Greatest, above all things in power and majesty.' }
];

selections.forEach(sel => {
    sel.element.addEventListener('click', () => {
        tasbihTxt.innerHTML = sel.text;
        countBtn.innerHTML = 0;
        tasbihTxt.style.color = sel.color;
        count = 1;
        selections.forEach(s => {
            s.element.style.color = s === sel ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.5)';
        });
        sel.element.addEventListener('dblclick', () => sel.element.style.color = 'rgba(0,255,119,0.76)');
        tasbihDes.innerHTML = sel.txtDec;
    });
});

function formatTime12Hour(timeStr) {
    let [h,m] = timeStr.split(':');
    h = parseInt(h);
    let p = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m} ${p}`;
}

function fetchPrayerTimes(lat, lon){
    fetch(`https://api.aladhan.com/v1/timings/today?latitude=${lat}&longitude=${lon}&method=1`)
    .then(res => res.json())
    .then(data => {
        const timings = data.data.timings;
        const now = new Date();
        dateH.innerHTML = now.toLocaleDateString('EN-UA', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
        dateM.innerHTML = now.toLocaleDateString('EN-UA-u-ca-islamic', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
        prayTimeFajr.innerHTML = formatTime12Hour(timings.Fajr);
        prayTimeSunrise.innerHTML = formatTime12Hour(timings.Sunrise);
        prayTimeDhuhr.innerHTML = formatTime12Hour(timings.Dhuhr);
        prayTimeAsr.innerHTML = formatTime12Hour(timings.Asr);
        prayTimeMaghrib.innerHTML = formatTime12Hour(timings.Maghrib);
        prayTimeIsha.innerHTML = formatTime12Hour(timings.Isha);

        function parsePrayerTime(timeStr) {
            const [hours, minutes] = timeStr.split(':').map(Number);
            const date = new Date();
            date.setHours(hours, minutes, 0, 0);
            return date;
        }

        function getNextPrayer(timings) {
            const prayers = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
            const now = new Date();

            for (let prayer of prayers) {
                const prayerTime = parsePrayerTime(timings[prayer]);
                if (prayerTime > now) return { name: prayer, time: prayerTime };
            }

            const tomorrowFajr = parsePrayerTime(timings["Fajr"]);
            tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
            return { name: "Fajr", time: tomorrowFajr };
        }

        function updateCountdown(timings) {
            const next = getNextPrayer(timings);
            const now = new Date();
            const diffMs = next.time - now;

            if (diffMs <= 0) return;

            const hours = Math.floor(diffMs / (1000 * 60 * 60));
            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

            prayTime.innerHTML = `${hours.toString()}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
            prayNow.innerHTML = next.name;

            const prayerCards = {
                "Fajr": prayTimeFajr.parentElement,
                "Sunrise": prayTimeSunrise.parentElement,
                "Dhuhr": prayTimeDhuhr.parentElement,
                "Asr": prayTimeAsr.parentElement,
                "Maghrib": prayTimeMaghrib.parentElement,
                "Isha": prayTimeIsha.parentElement
            };

            const prayerColors = {
                "Fajr": "linear-gradient(to right, #09002fff, #3971ffff, #FFD6A5)",
                "Sunrise": "linear-gradient(to right, #fff6a5ff, #cdd159ff, #ffff65ff)",
                "Dhuhr": "linear-gradient(to right, #fee713ff, #ffa632ff, #ff5100ff)",
                "Asr": "linear-gradient(to right, #ff6127ff, #ffde20ff, #ccbb00ff)",
                "Maghrib": "linear-gradient(to right, #822affff, #4208cbff, #1a0057ff)",
                "Isha": "linear-gradient(to right, #3A0CA3, #0f003fff, #070017ff)"
            };

            const shadowColors = {
                "Fajr": "#FFD6A5",
                "Sunrise": "#ffff50ff",
                "Dhuhr": "#ff5100ff",
                "Asr": "#ccbb00ff",
                "Maghrib": "#1a0057ff",
                "Isha": "#070017ff"
            };

            for (let prayer in prayerCards) {
                const card = prayerCards[prayer];

                if (prayer === next.name) {
                    card.style.background = prayerColors[prayer];
                    card.style.boxShadow = `0 0 45px ${shadowColors[prayer]}`;
                    card.style.transition = '.3s';
                    card.onmouseover = () => card.style.width = '85%';
                    card.onmouseleave = () => card.style.width = '80%';
                } else {
                    card.style.background = "";
                    card.style.boxShadow = "";
                    card.style.width = '80%';
                    card.onmouseover = null;
                    card.onmouseleave = null;
                }
            }
        }


        setInterval(() => updateCountdown(timings), 1000);

    })
    .catch(err => console.error('Error fetching prayer times:', err));
}

if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
        fetchPrayerTimes(pos.coords.latitude, pos.coords.longitude);
    }, err => console.error(err));
}

function updateTime() {
    timeNow.innerHTML = new Date().toLocaleTimeString();
}
updateTime();
setInterval(updateTime,1000);

const ayahTextEl = document.querySelector('.ayah-text');
const ayahTranslationEl = document.querySelector('.ayah-translation');
const btn = document.getElementById('newAyahBtn');
const nameOfSurah = document.querySelector('.name-of-surah');

async function getRandomAyah() {
    const surahNumber = Math.floor(Math.random() * 114) + 1;
    const surahRes = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
    const surahData = await surahRes.json();
    const numberOfAyahs = surahData.data.numberOfAyahs;
    const nameSurah = surahData.data.englishName + ' - ' + surahData.data.name;
    const ayahNumber = Math.floor(Math.random() * numberOfAyahs) + 1;

    try {
        const res = await fetch(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/editions/quran-simple,en.asad`);
        const data = await res.json();
        const arabic = data.data[0].text;
        const translation = data.data[1].text;
        nameOfSurah.textContent = nameSurah;
        ayahTextEl.textContent = arabic;
        ayahTranslationEl.textContent = translation;
    } catch(err) {
        ayahTextEl.textContent = 'حدث خطأ أثناء تحميل الآية.';
        ayahTranslationEl.textContent = '';
        console.error(err);
    }
}

getRandomAyah();
btn.addEventListener('click', getRandomAyah);

// الحديث

const nameOfHadithArabic = document.querySelector('.name-of-hadith-arabic');
const nameOfHadithEnglish = document.querySelector('.name-of-hadith-english');
const hadithText = document.querySelector('.hadith-text');
const hadithTranslation = document.querySelector('.hadith-translation');
const newHadithBtn = document.getElementById('newHadithBtn');

async function getRandomHadith() {
  const randomBook = Math.random() < 0.5 ? 'bukhari' : 'muslim';
  const maxHadiths = randomBook === 'bukhari' ? 7563 : 5362;
  const randomNumber = Math.floor(Math.random() * maxHadiths) + 1;

  const arabicUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-${randomBook}/${randomNumber}.json`;
  const englishUrl = `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-${randomBook}/${randomNumber}.json`;

  try {
    const [araRes, engRes] = await Promise.all([fetch(arabicUrl), fetch(englishUrl)]);
    const araData = await araRes.json();
    const engData = await engRes.json();

    const arabicText = araData.hadiths[0].text;
    const englishText = engData.hadiths[0].text;

    nameOfHadithArabic.textContent = `${randomBook === 'bukhari' ? 'صحيح البخاري' : 'صحيح مسلم'} - حديث رقم ${randomNumber}`;
    nameOfHadithEnglish.textContent = `${randomBook === 'bukhari' ? 'Sahih al-Bukhari' : 'Sahih Muslim'} - Hadith No. ${randomNumber}`;
    hadithText.textContent = arabicText;
    hadithTranslation.textContent = englishText;

  } catch (error) {
    console.error('Error fetching hadith:', error);
    nameOfHadithArabic.textContent = 'خطأ في جلب الحديث';
    nameOfHadithEnglish.textContent = 'Error fetching hadith';
    hadithText.textContent = '';
    hadithTranslation.textContent = '';
  }
}

newHadithBtn.addEventListener('click', getRandomHadith);

getRandomHadith();

window.onload = () => {
    setTimeout(() => {
        document.getElementById('location-warning').classList.add('trans');
        setTimeout(() => {
            document.getElementById('location-warning').classList.remove('trans');
            document.getElementById('location-warning').style.display = 'none';
        }, 4000);
    }, 1000);
}