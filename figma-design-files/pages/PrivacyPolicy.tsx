import React from "react";
import { Card } from "../components/ui/card";
import AnimatedBackground from "../components/AnimatedBackground";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen relative pt-24 pb-20">
      <AnimatedBackground />
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <h1 className="text-4xl font-bold mb-8">Politica de Confidențialitate</h1>
        <p className="text-muted-foreground mb-8">Ultima actualizare: 16 Noiembrie 2025</p>

        <div className="space-y-8">
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introducere</h2>
            <p className="text-muted-foreground leading-relaxed">
              Bookerino ("noi", "compania noastră" sau "serviciul nostru") se angajează să protejeze confidențialitatea utilizatorilor săi. Această Politică de Confidențialitate explică modul în care colectăm, utilizăm, divulgăm și protejăm informațiile dumneavoastră personale atunci când utilizați aplicația noastră desktop de management HoReCa și website-ul asociat.
            </p>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-4">2. Informații pe Care le Colectăm</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <div>
                <h3 className="font-semibold text-foreground mb-2">2.1 Informații de Cont</h3>
                <p>Când vă creați un cont, colectăm: nume, adresă de email, parolă (criptată), poza de profil (opțional).</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">2.2 Informații despre Afacere</h3>
                <p>Pentru funcționalitatea aplicației, colectăm: date despre proprietate (hotel, pensiune), informații despre camere și prețuri, date despre rezervări și oaspeți, rapoarte financiare.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">2.3 Informații de Plată</h3>
                <p>Datele de plată sunt procesate securizat prin procesatori terți certificați. Nu stocăm informații complete despre carduri de credit.</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">2.4 Date de Utilizare</h3>
                <p>Colectăm informații despre modul în care utilizați aplicația: date de conectare/deconectare, funcționalități accesate, erori și crash-uri (pentru îmbunătățirea serviciului).</p>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-4">3. Cum Utilizăm Informațiile</h2>
            <div className="space-y-2 text-muted-foreground">
              <p>• Furnizarea și menținerea serviciilor Bookerino</p>
              <p>• Procesarea rezervărilor și gestionarea operațiunilor hoteliere</p>
              <p>• Sincronizarea cu Booking.com și Google Ads prin API-uri</p>
              <p>• Îmbunătățirea și optimizarea aplicației</p>
              <p>• Comunicarea cu dvs. despre actualizări și suport tehnic</p>
              <p>• Procesarea abonamentelor și facturarea</p>
              <p>• Protejarea împotriva fraudelor și abuzurilor</p>
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-4">4. Partajarea Informațiilor</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>Nu vindem și nu înch iriem informațiile dumneavoastră personale. Partajăm date doar în următoarele circumstanțe:</p>
              <div className="ml-4 space-y-2">
                <p>• <strong>Servicii Terțe:</strong> Booking.com API (pentru sincronizarea rezervărilor), Google Ads API (pentru gestionarea campaniilor), procesatori de plăți (pentru tranzacții securizate)</p>
                <p>• <strong>Cerințe Legale:</strong> Când suntem obligați legal să dezvăluim informații</p>
                <p>• <strong>Protecție:</strong> Pentru a proteja drepturile și siguranța utilizatorilor noștri</p>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-4">5. Securitatea Datelor</h2>
            <p className="text-muted-foreground leading-relaxed">
              Implementăm măsuri de securitate tehnice și organizatorice pentru a proteja datele dumneavoastră:
            </p>
            <div className="mt-4 space-y-2 text-muted-foreground">
              <p>• Criptarea datelor în tranzit (SSL/TLS)</p>
              <p>• Criptarea parolelor cu algoritmi puternici</p>
              <p>• Acces restricționat la date personale</p>
              <p>• Monitorizare constantă pentru vulnerabilități</p>
              <p>• Backup-uri regulate și securizate</p>
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-4">6. Drepturile Dumneavoastră (GDPR)</h2>
            <div className="space-y-2 text-muted-foreground">
              <p>Conform GDPR, aveți următoarele drepturi:</p>
              <p>• <strong>Dreptul de acces:</strong> Puteți solicita o copie a datelor personale pe care le deținem</p>
              <p>• <strong>Dreptul la rectificare:</strong> Puteți corecta date inexacte</p>
              <p>• <strong>Dreptul la ștergere:</strong> Puteți solicita ștergerea datelor ("dreptul de a fi uitat")</p>
              <p>• <strong>Dreptul la portabilitate:</strong> Puteți primi datele într-un format structurat</p>
              <p>• <strong>Dreptul la opoziție:</strong> Puteți obiecta la procesarea datelor</p>
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-4">7. Retenția Datelor</h2>
            <p className="text-muted-foreground leading-relaxed">
              Păstrăm datele dumneavoastră personale doar atât timp cât este necesar pentru scopurile descrise în această politică. După anularea contului, datele sunt șterse în termen de 30 de zile, cu excepția informațiilor care trebuie păstrate din motive legale (de exemplu, facturi pentru evidență fiscală).
            </p>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-4">8. Cookie-uri și Tehnologii Similare</h2>
            <p className="text-muted-foreground leading-relaxed">
              Utilizăm cookie-uri esențiale pentru funcționarea aplicației (autentificare, preferințe). Nu folosim cookie-uri de tracking sau publicitate. Puteți controla cookie-urile din setările browser-ului dumneavoastră.
            </p>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-4">9. Modificări ale Politicii</h2>
            <p className="text-muted-foreground leading-relaxed">
              Ne rezervăm dreptul de a actualiza această Politică de Confidențialitate. Vă vom notifica prin email sau prin aplicație despre orice modificări semnificative. Data ultimei actualizări este afișată în partea de sus a acestui document.
            </p>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-4">10. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              Pentru întrebări despre această Politică de Confidențialitate sau pentru a vă exercita drepturile GDPR, vă rugăm să ne contactați la:
            </p>
            <div className="mt-4 text-muted-foreground">
              <p>Email: privacy@bookerino.net</p>
              <p>Adresă: Str. Exemplu Nr. 123, București, România, 010101</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
