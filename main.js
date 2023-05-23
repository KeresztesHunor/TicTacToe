/*
 0 | 1 | 2
---+---+---
 3 | 4 | 5
---+---+---
 6 | 7 | 8
*/

const SEMLEGES = "semleges";
const JATEKOS = "jatekos";
const GEP = "gep";

let lepesSzamlalo = 0;

let jatekVege = false;

let mezok = null;
let gyoztesKiiras = null;

window.addEventListener("load", () => {
    const TIC_TAC_TOE = document.querySelector("#ticTacToe");
    letezoTagekKozeIr(TIC_TAC_TOE, (() => {
        let txt = "";
        for (let i = 0; i < 9; i++)
        {
            txt += ujTagekKozeIr("div", `class="mezo ${SEMLEGES}"`);
        }
        return txt;
    })());
    mezok = document.querySelectorAll("#ticTacToe > .mezo");
    mezok.forEach((mezo, index) => {
        mezo.addEventListener("click", () => {
            if (jatekVege)
            {
                return;
            }
            if (mezo.classList[1] === SEMLEGES)
            {
                mezo.classList.remove(SEMLEGES);
                mezo.classList.add(JATEKOS);
                if (nyertEAJatekos(index))
                {
                    jatekVege = true;
                    letezoTagekKozeIr(gyoztesKiiras, ujTagekKozeIr("h1", null, "Te nyertél!"));
                }
                else if (++lepesSzamlalo < 9)
                {
                    const GEP_LEPES_MEZO_INDEX = gepLepesMezoIndex();
                    mezok[GEP_LEPES_MEZO_INDEX].classList.remove(SEMLEGES);
                    mezok[GEP_LEPES_MEZO_INDEX].classList.add(GEP);
                    lepesSzamlalo++;
                }
                else
                {
                    jatekVege = true;
                    letezoTagekKozeIr(gyoztesKiiras, ujTagekKozeIr("h1", null, "Döntetlen"));
                }
            }
        });
    });
    const LENULLAZ = document.querySelector("#lenullaz");
    LENULLAZ.addEventListener("click", () => {
        mezok.forEach(mezo => {
            if (mezo.classList[1] === JATEKOS)
            {
                mezo.classList.remove(JATEKOS);
            }
            else if (mezo.classList[1] === GEP)
            {
                mezo.classList.remove(GEP);
            }
            mezo.classList.add(SEMLEGES);
        });
        lepesSzamlalo = 0;
        letezoTagekKozeIr(gyoztesKiiras, "");
        jatekVege = false;
    });
    gyoztesKiiras = document.querySelector("#gyoztesKiiras");
});

function nyertEAJatekos(jatekosLepesMezoIndex)
{
    if (jatekosLepesMezoIndex === 0 || jatekosLepesMezoIndex === 8)
    {
        if (megvanEHarom([0, 4, 8]))
        {
            return true;
        }
    }
    else if (jatekosLepesMezoIndex === 2 || jatekosLepesMezoIndex === 6)
    {
        if (megvanEHarom([2, 4, 6]))
        {
            return true;
        }
    }
    else if (jatekosLepesMezoIndex === 4)
    {
        if (megvanEHarom([0, 4, 8]) || megvanEHarom([2, 4, 6]))
        {
            return true;
        }
    }
    if (megvanEHarom(indexListatFeltolt(Math.floor(jatekosLepesMezoIndex / 3) * 3, i => i.i++)))
    {
        return true;
    }
    if (megvanEHarom(indexListatFeltolt(jatekosLepesMezoIndex % 3, i => i.i += 3)))
    {
        return true;
    }
    return false;
}

function megvanEHarom(mezoIndexek)
{
    for (let i = 0; i < mezoIndexek.length; i++)
    {
        if (mezok[mezoIndexek[i]].classList[1] !== JATEKOS)
        {
            return false;
        }
    }
    return true;
}

function indexListatFeltolt(kezdoErtek, leptetes)
{
    const mezoIndexek = [];
    for (const i = { i: kezdoErtek }; i.i < 9; leptetes(i))
    {
        mezoIndexek.push(i.i);
    }
    return mezoIndexek;
}

function gepLepesMezoIndex()
{
    let gepLepesMezoIndex = uresMezotKeres(GEP);
    if (gepLepesMezoIndex !== -1)
    {
        jatekVege = true;
        letezoTagekKozeIr(gyoztesKiiras, ujTagekKozeIr("h1", null, "A gép nyert!"));
        return gepLepesMezoIndex;
    }
    gepLepesMezoIndex = uresMezotKeres(JATEKOS);
    if (gepLepesMezoIndex !== -1)
    {
        return gepLepesMezoIndex;
    }
    const URES_MEZO_INDEXEK = [];
    for (let i = 0; i < 9; i++)
    {
        if (mezok[i].classList[1] === SEMLEGES)
        {
            URES_MEZO_INDEXEK.push(i);
        }
    }
    return URES_MEZO_INDEXEK[Math.floor(Math.random() * URES_MEZO_INDEXEK.length)];
}

function uresMezotKeres(keresettMezoTipus)
{
    let gepLepesMezoIndex = -1;
    for (let x = 0; x < 3; x++)
    {
        const SOR_INDEXEK = [];
        const OSZLOP_INDEXEK = [];
        for (let y = 0; y < 3; y++)
        {
            SOR_INDEXEK.push(3 * x + y);
            OSZLOP_INDEXEK.push(x + 3 * y);
        }
        gepLepesMezoIndex = haromMezobenUresetKeres(SOR_INDEXEK, keresettMezoTipus);
        if (gepLepesMezoIndex !== -1)
        {
            return gepLepesMezoIndex;
        }
        gepLepesMezoIndex = haromMezobenUresetKeres(OSZLOP_INDEXEK, keresettMezoTipus);
        if (gepLepesMezoIndex !== -1)
        {
            return gepLepesMezoIndex;
        }
    }
    gepLepesMezoIndex = haromMezobenUresetKeres([0, 4, 8], keresettMezoTipus);
    if (gepLepesMezoIndex !== -1)
    {
        return gepLepesMezoIndex;
    }
    gepLepesMezoIndex = haromMezobenUresetKeres([2, 4, 6], keresettMezoTipus);
    if (gepLepesMezoIndex !== -1)
    {
        return gepLepesMezoIndex;
    }
    return -1;
}

function haromMezobenUresetKeres(mezoIndexek, keresettMezoTipus)
{
    let gepMezokSzama = 0;
    let semlegesMezokSzama = 0;
    let uresMezoIndexe = -1;
    mezoIndexek.forEach(mezoIndex =>
    {
        const MEZO_ERTEK = mezok[mezoIndex].classList[1];
        if (MEZO_ERTEK === keresettMezoTipus)
        {
            gepMezokSzama++;
        }
        else if (MEZO_ERTEK === SEMLEGES)
        {
            semlegesMezokSzama++;
            uresMezoIndexe = mezoIndex;
        }
    });
    if (gepMezokSzama === 2 && semlegesMezokSzama === 1)
    {
        return uresMezoIndexe;
    }
    return -1;
}

function letezoTagekKozeIr(szuloElem, tartalom)
{
    szuloElem.innerHTML = tartalom;
}

function letezoTagekhezIr(szuloElem, tartalom)
{
    szuloElem.innerHTML += tartalom;
}

function ujTagekKozeIr(tag, parameterek = null, tartalom = "")
{
    return `<${tag}${parameterek ? " " + parameterek : ""}>${tartalom}</${tag}>`;
}
