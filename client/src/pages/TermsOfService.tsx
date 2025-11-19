import React from "react";
import { Card } from "../components/ui/card";
import AnimatedBackground from "../components/AnimatedBackground";

const TermsOfService = () => {
  return (
    <div className="min-h-screen relative pt-24 pb-20">
      <AnimatedBackground />
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <h1 className="text-4xl font-bold mb-8">Termeni și Condiții</h1>
        <p className="text-muted-foreground mb-8">Ultima actualizare: 16 Noiembrie 2025</p>

        <div className="space-y-8">
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptarea Termenilor</h2>
            <p className="text-muted-foreground leading-relaxed">
              Bun venit la Bookerino! Prin accesarea și utilizarea aplicației noastre desktop de management HoReCa și a website-ului asociat, sunteți de acord să respectați acești Termeni și Condiții. Dacă nu sunteți de acord cu acești termeni, vă rugăm să nu utilizați serviciile noastre.
            </p>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-4">2. Descrierea Serviciului</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Bookerino este o aplicație desktop profesională concepută pentru managementul afacerilor din industria HoReCa (Hoteluri, Restaurante, Cafenele). Serviciile includ:
              </p>
              <ul className="ml-6 space-y-2 list-disc">
                <li>Aplicație desktop pentru Windows, macOS și Linux</li>
                <li>Management rezervări cu confirmări automate</li>
                <li>Analiză financiară și rapoarte în timp real</li>
                <li>Integrare cu Booking.com prin API</li>
                <li>Integrare cu Google Ads pentru campanii de marketing</li>
                <li>Management recenzii și reputație online</li>
                <li>Suport tehnic și actualizări regulate</li>
              </ul>
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-4">3. Înregistrare și Cont</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <div>
                <h3 className="font-semibold text-foreground mb-2">3.1 Crearea Contului</h3>
                <p>Pentru a utiliza Bookerino, trebuie să vă creați un cont furnizând informații corecte și complete. Sunteți responsabil pentru menținerea confidențialității parolei și pentru toate activitățile care au loc sub contul dumneavoastră.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">3.2 Eligibilitate</h3>
                <p>Trebuie să aveți cel puțin 18 ani pentru a crea un cont și a utiliza serviciile noastre. Declarați că toate informațiile furnizate sunt corecte și actualizate.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">3.3 Securitatea Contului</h3>
                <p>Sunteți responsabil pentru protejarea accesului la contul dumneavoastră. Notificați-ne imediat în cazul utilizării neautorizate a contului.</p>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-4">4. Abonamente și Plăți</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <div>
                <h3 className="font-semibold text-foreground mb-2">4.1 Planuri de Abonament</h3>
                <p>Bookerino oferă două planuri de abonament:</p>
                <ul className="ml-6 mt-2 space-y-1 list-disc">
                  <li><strong>Professional:</strong> €45/lună - până la 50 camere</li>
                  <li><strong>Enterprise:</strong> €450/an (€37.50/lună) - camere nelimitate</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">4.2 Perioadă de Probă</h3>
                <p>Oferim o perioadă de probă gratuită de 7 zile pentru utilizatori noi. Nu este necesar card de credit pentru a începe perioada de probă. La finalul perioadei, contul va fi dezactivat dacă nu alegeți un plan de abonament.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">4.3 Facturare</h3>
                <p>Abonamentele sunt facturate lunar sau anual, în funcție de planul ales. Plățile sunt procesate securizat prin procesatori terți certificați. Veți primi facturi electronice la adresa de email înregistrată.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">4.4 Anulare și Rambursare</h3>
                <p>Puteți anula abonamentul oricând din setările contului. Anularea are efect la sfârșitul perioadei de facturare curente. Nu oferim rambursări pentru perioadele deja plătite, cu excepția cazurilor prevăzute de lege.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">4.5 Modificări de Preț</h3>
                <p>Ne rezervăm dreptul de a modifica prețurile cu o notificare prealabilă de 30 de zile. Modificările de preț nu se aplică retroactiv și nu afectează perioada de facturare curentă.</p>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-4">5. Utilizarea Serviciului</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <div>
                <h3 className="font-semibold text-foreground mb-2">5.1 Licență de Utilizare</h3>
                <p>Vă acordăm o licență limitată, neexclusivă, netransferabilă pentru a utiliza aplicația Bookerino în conformitate cu acești termeni. Această licență este valabilă pe durata abonamentului activ.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">5.2 Restricții</h3>
                <p>Nu aveți voie să:</p>
                <ul className="ml-6 mt-2 space-y-1 list-disc">
                  <li>Copiați, modificați sau distribuiți aplicația</li>
                  <li>Decompilați sau efectuați reverse engineering</li>
                  <li>Utilizați serviciul pentru activități ilegale</li>
                  <li>Încercați să accesați conturile altor utilizatori</li>
                  <li>Supraîncărcați sau să perturbați serverele noastre</li>
                  <li>Eliminați sau alterați notificările de drepturi de autor</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">5.3 Cerințe Tehnice</h3>
                <p>Bookerino necesită conexiune la internet pentru a funcționa optim. Aplicația utilizează API-uri externe pentru Booking.com și Google Ads, care necesită autentificare și conexiune activă.</p>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-4">6. Integrări cu Terțe Părți</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <div>
                <h3 className="font-semibold text-foreground mb-2">6.1 Booking.com și Google Ads</h3>
                <p>Bookerino se integrează cu Booking.com și Google Ads prin API-urile lor oficiale. Utilizarea acestor integrări este supusă termenilor și condițiilor respective ale Booking.com și Google. Nu suntem responsabili pentru modificări sau întreruperi ale acestor servicii terțe.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">6.2 Responsabilitate</h3>
                <p>Nu garantăm disponibilitatea neîntreruptă a serviciilor terțe. Orice probleme cu API-urile Booking.com sau Google Ads trebuie raportate direct către acele platforme.</p>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-4">7. Proprietate Intelectuală</h2>
            <p className="text-muted-foreground leading-relaxed">
              Toate drepturile de proprietate intelectuală asupra aplicației Bookerino, inclusiv cod sursă, design, logo-uri și documentație, aparțin companiei noastre. Datele pe care le introduceți în aplicație (rezervări, informații despre oaspeți, rapoarte) rămân proprietatea dumneavoastră.
            </p>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-4">8. Confidențialitate și Protecția Datelor</h2>
            <p className="text-muted-foreground leading-relaxed">
              Colectăm și procesăm datele dumneavoastră personale în conformitate cu Politica noastră de Confidențialitate și GDPR. Implementăm măsuri de securitate pentru a proteja informațiile dumneavoastră. Pentru detalii complete, consultați Politica de Confidențialitate.
            </p>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-4">9. Limitarea Responsabilității</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Bookerino este furnizat "ca atare" și "după disponibilitate". Nu garantăm că serviciul va fi neîntrerupt, fără erori sau complet sigur. În limitele permise de lege, nu suntem responsabili pentru:
              </p>
              <ul className="ml-6 space-y-1 list-disc">
                <li>Pierderi de date cauzate de factori în afara controlului nostru</li>
                <li>Daune indirecte, incidentale sau consecutive</li>
                <li>Pierderi de profit sau venituri</li>
                <li>Întreruperi ale serviciilor terțe (Booking.com, Google Ads)</li>
              </ul>
              <p className="mt-4">
                Responsabilitatea noastră totală nu va depăși suma plătită de dumneavoastră pentru serviciu în ultimele 12 luni.
              </p>
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-4">10. Disponibilitate și Mentenanță</h2>
            <p className="text-muted-foreground leading-relaxed">
              Ne rezervăm dreptul de a efectua mentenanță programată sau de urgență. Vom încerca să vă notificăm în avans despre întreruperile planificate. În cazuri de urgență, serviciul poate fi temporar indisponibil fără notificare prealabilă.
            </p>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-4">11. Încetarea Serviciului</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <div>
                <h3 className="font-semibold text-foreground mb-2">11.1 Încetare de către Utilizator</h3>
                <p>Puteți înceta utilizarea serviciului oricând prin anularea abonamentului sau ștergerea contului din setările contului.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">11.2 Încetare de către Bookerino</h3>
                <p>Ne rezervăm dreptul de a suspenda sau închide contul dumneavoastră dacă încălcați acești Termeni și Condiții, dacă utilizați serviciul în mod abuziv sau ilegal, sau dacă există activități frauduloase.</p>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-4">12. Modificări ale Termenilor</h2>
            <p className="text-muted-foreground leading-relaxed">
              Ne rezervăm dreptul de a actualiza acești Termeni și Condiții. Vă vom notifica despre modificări semnificative prin email sau prin aplicație cu cel puțin 30 de zile înainte ca acestea să intre în vigoare. Utilizarea continuă a serviciului după modificări constituie acceptarea noilor termeni.
            </p>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-4">13. Legea Aplicabilă</h2>
            <p className="text-muted-foreground leading-relaxed">
              Acești Termeni și Condiții sunt guvernați de legile din România. Orice litigiu va fi soluționat în instanțele competente din București, România.
            </p>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-4">14. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              Pentru întrebări despre acești Termeni și Condiții, vă rugăm să ne contactați la:
            </p>
            <div className="mt-4 text-muted-foreground">
              <p>Email: legal@bookerino.net</p>
              <p>Adresă: Str. Exemplu Nr. 123, București, România, 010101</p>
            </div>
          </Card>

          <Card className="p-8 bg-muted/30">
            <p className="text-sm text-muted-foreground">
              Prin utilizarea Bookerino, confirmați că ați citit, înțeles și acceptat acești Termeni și Condiții în întregime.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;

