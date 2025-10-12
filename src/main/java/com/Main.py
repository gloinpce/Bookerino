import os
import sys
import psycopg2
from psycopg2.extras import RealDictCursor

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("DATABASE_URL:postgresql://book:6j9T89b7jF3fjd1UN_XhLQ@street-fish-16944.j77.aws-eu-central-1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full")
    sys.exit(1)


def get_conn():
    return psycopg2.connect(dsn=DATABASE_URL)


def display_rooms(conn):
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT id, room_number, room_type, price_per_night, status, capacity FROM rooms ORDER BY room_number")
            rows = cur.fetchall()
            print("\n--- LISTA CAMERE ---")
            print(f"{'Nr. Cameră':<12}{'Tip':<16}{'Preț/Noapte':<16}{'Status':<12}{'Capacitate':<10}")
            print("─" * 70)
            for r in rows:
                print(f"{r['room_number']:<12}{r['room_type']:<16}{r['price_per_night']:>10.2f} RON   {r['status']:<12}{r['capacity']:<10}")
    except Exception as e:
        print("Eroare la afișarea camerelor:", e)


def add_room(conn):
    try:
        room_number = input("Număr cameră: ").strip()
        room_type = input("Tip cameră (Single/Double/Suite): ").strip()
        price = get_float_input("Preț pe noapte (RON): ")
        capacity = get_int_input("Capacitate: ")

        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO rooms (room_number, room_type, price_per_night, capacity, status)
                VALUES (%s, %s, %s, %s, %s)
                """,
                (room_number, room_type, price, capacity, "available"),
            )
        conn.commit()
        print("✓ Cameră adăugată cu succes!")
    except Exception as e:
        conn.rollback()
        print("Eroare la adăugarea camerei:", e)


def display_bookings(conn):
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT b.*, r.room_number
                FROM bookings b
                JOIN rooms r ON b.room_id = r.id
                ORDER BY b.check_in DESC
                LIMIT 20
            """)
            rows = cur.fetchall()
            print("\n--- LISTA REZERVĂRI (ultimele 20) ---")
            print(f"{'Nume Client':<18}{'Cameră':<10}{'Check-in':<14}{'Check-out':<14}{'Status':<12}{'Total':<10}")
            print("─" * 80)
            for r in rows:
                print(f"{r['guest_name']:<18}{r['room_number']:<10}{str(r['check_in']):<14}{str(r['check_out']):<14}{r['status']:<12}{r['total_price']:>10.2f} RON")
    except Exception as e:
        print("Eroare la afișarea rezervărilor:", e)


def add_booking(conn):
    try:
        guest_name = input("Nume client: ").strip()
        guest_email = input("Email client: ").strip()
        guest_phone = input("Telefon client: ").strip()

        display_rooms(conn)
        room_number = input("\nNumăr cameră: ").strip()

        check_in = input("Data check-in (YYYY-MM-DD): ").strip()
        check_out = input("Data check-out (YYYY-MM-DD): ").strip()
        total_price = get_float_input("Preț total (RON): ")

        with conn.cursor() as cur:
            cur.execute("SELECT id FROM rooms WHERE room_number = %s", (room_number,))
            row = cur.fetchone()
            if not row:
                print("Camera nu a fost găsită!")
                return
            room_id = row[0]

            cur.execute(
                """
                INSERT INTO bookings
                (room_id, guest_name, guest_email, guest_phone, check_in, check_out, total_price, status)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (room_id, guest_name, guest_email, guest_phone, check_in, check_out, total_price, "confirmed"),
            )
        conn.commit()
        print("✓ Rezervare adăugată cu succes!")
    except Exception as e:
        conn.rollback()
        print("Eroare la adăugarea rezervării:", e)


def display_reviews(conn):
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT r.*, rm.room_number
                FROM reviews r
                JOIN rooms rm ON r.room_id = rm.id
                ORDER BY r.created_at DESC
                LIMIT 20
            """)
            rows = cur.fetchall()
            print("\n--- LISTA RECENZII (ultimele 20) ---")
            print(f"{'Nume Client':<18}{'Cameră':<10}{'Rating':<8}{'Comentariu'}")
            print("─" * 80)
            for r in rows:
                comment = r.get("comment", "") or ""
                if len(comment) > 60:
                    comment = comment[:57] + "..."
                print(f"{r['guest_name']:<18}{r['room_number']:<10}{r['rating']:<8}{comment}")
    except Exception as e:
        print("Eroare la afișarea recenziilor:", e)


def show_analytics(conn):
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM rooms")
            total_rooms = cur.fetchone()[0]

            cur.execute("SELECT COUNT(*) FROM bookings")
            total_bookings = cur.fetchone()[0]

            cur.execute("SELECT COALESCE(SUM(total_price),0) FROM bookings WHERE status = 'confirmed'")
            total_revenue = float(cur.fetchone()[0] or 0)

            cur.execute("SELECT COALESCE(AVG(rating),0) FROM reviews")
            avg_rating = float(cur.fetchone()[0] or 0)

        print("\n=== ANALITICĂ ===")
        print("─" * 40)
        print(f"Total Camere:        {total_rooms}")
        print(f"Total Rezervări:     {total_bookings}")
        print(f"Venit Total:         {total_revenue:.2f} RON")
        print(f"Rating Mediu:        {avg_rating:.2f}/5")
        print("─" * 40)
    except Exception as e:
        print("Eroare la afișarea analiticii:", e)


def get_int_input(prompt="Alegeți o opțiune (număr): "):
    while True:
        val = input(prompt)
        try:
            return int(val)
        except ValueError:
            print("Vă rugăm introduceți un număr valid.")


def get_float_input(prompt="Introduceți un număr: "):
    while True:
        val = input(prompt)
        try:
            return float(val)
        except ValueError:
            print("Vă rugăm introduceți un număr valid.")


def main():
    try:
        conn = get_conn()
    except Exception as e:
        print("Nu s-a putut conecta la baza de date:", e)
        return

    print("✓ Conexiune la baza de date stabilită")
    print("=====================================")
    print("   Bine ați venit la BOOKERINO!")
    print("=====================================\n")

    running = True
    try:
        while running:
            print("\n=== MENIU PRINCIPAL ===")
            print("1. Gestionare Camere")
            print("2. Gestionare Rezervări")
            print("3. Gestionare Recenzii")
            print("4. Analitică")
            print("5. Ieșire")
            choice = get_int_input("Alegeți o opțiune (1-5): ")

            if choice == 1:
                print("\n=== GESTIONARE CAMERE ===")
                print("1. Afișare toate camerele")
                print("2. Adăugare cameră nouă")
                print("3. Înapoi")
                c = get_int_input("Alegeți o opțiune: ")
                if c == 1:
                    display_rooms(conn)
                elif c == 2:
                    add_room(conn)
                else:
                    continue
            elif choice == 2:
                print("\n=== GESTIONARE REZERVĂRI ===")
                print("1. Afișare toate rezervările")
                print("2. Adăugare rezervare nouă")
                print("3. Înapoi")
                c = get_int_input("Alegeți o opțiune: ")
                if c == 1:
                    display_bookings(conn)
                elif c == 2:
                    add_booking(conn)
                else:
                    continue
            elif choice == 3:
                manage_choice = get_int_input("\n1. Afișare toate recenziile\n2. Înapoi\nAlegeți o opțiune: ")
                if manage_choice == 1:
                    display_reviews(conn)
            elif choice == 4:
                show_analytics(conn)
            elif choice == 5:
                running = False
            else:
                print("Opțiune invalidă!")
    finally:
        try:
            conn.close()
        except Exception:
            pass
        print("\nLa revedere!")


if __name__ == "__main__":
    main()