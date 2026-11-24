"""
Database initialization script for the NEET Intelligence Platform.
Creates tables, default roles, admin user, and seeds demo evidence records.
"""
import sys
import os

# Ensure the backend directory is on the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import engine, Base, SessionLocal
from app.core.security import hash_password
from app.core.config import settings

# Import all models so they register with Base.metadata
import app.models


def init_database():
    """Create all tables and seed initial data."""
    print("[1/5] Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print(f"      Database: {settings.DATABASE_URL}")

    db = SessionLocal()
    try:
        # --- Roles ---
        print("[2/5] Creating default roles...")
        from app.models.user import Role, User, UserRole

        role_names = [
            ("admin", "Platform Administrator with full access"),
            ("researcher", "Research user with analysis and reporting access"),
            ("analyst", "Data analyst with read and analysis access"),
            ("viewer", "Read-only viewer"),
        ]
        for name, desc in role_names:
            existing = db.query(Role).filter(Role.name == name).first()
            if not existing:
                db.add(Role(name=name, description=desc))
                print(f"      Created role: {name}")
            else:
                print(f"      Role exists: {name}")
        db.commit()

        # --- Admin User ---
        print("[3/5] Creating admin user...")
        admin = db.query(User).filter(User.email == "admin@neet.platform").first()
        if not admin:
            admin = User(
                email="admin@neet.platform",
                username="admin",
                hashed_password=hash_password("admin123"),
                full_name="Platform Administrator",
                organization="NEET Intelligence Platform",
                is_active=True,
                is_superuser=True,
            )
            db.add(admin)
            db.commit()
            db.refresh(admin)

            # Assign admin role
            admin_role = db.query(Role).filter(Role.name == "admin").first()
            if admin_role:
                db.add(UserRole(user_id=admin.id, role_id=admin_role.id))
                db.commit()
            print(f"      Created admin: admin@neet.platform / admin123")
        else:
            print(f"      Admin user exists: admin@neet.platform")

        # --- Demo Researcher ---
        print("[4/5] Creating demo researcher...")
        researcher = db.query(User).filter(User.email == "researcher@neet.platform").first()
        if not researcher:
            researcher = User(
                email="researcher@neet.platform",
                username="researcher",
                hashed_password=hash_password("research123"),
                full_name="Dr. A. Sharma",
                organization="Centre for Youth Studies",
                is_active=True,
                is_superuser=False,
            )
            db.add(researcher)
            db.commit()
            db.refresh(researcher)

            researcher_role = db.query(Role).filter(Role.name == "researcher").first()
            if researcher_role:
                db.add(UserRole(user_id=researcher.id, role_id=researcher_role.id))
                db.commit()
            print(f"      Created researcher: researcher@neet.platform / research123")
        else:
            print(f"      Researcher exists: researcher@neet.platform")

        # --- Seed Evidence Records ---
        print("[5/5] Seeding evidence registry...")
        from app.models.evidence import EvidenceRecord

        evidence_count = db.query(EvidenceRecord).count()
        if evidence_count == 0:
            evidence_entries = [
                EvidenceRecord(
                    title="Youth NEET in India: Measurement challenges across PLFS, IHDS, and UDAYA",
                    source_type="journal_article",
                    authors="Synthetic Research Reference",
                    year=2024,
                    journal="Journal of Youth Studies (Fictional Reference)",
                    country="India",
                    population="Youth aged 15-29",
                    study_design="cross-sectional",
                    quality_score=8.5,
                    evidence_grade="B",
                    abstract="This synthetic evidence record demonstrates the platform's evidence registry capability. It does not represent actual published research.",
                    key_results="Demonstrates how the platform catalogues research findings with quality grades and methodological metadata.",
                    policy_implications="Evidence-based policy design requires systematic evidence registries that track study quality, population coverage, and methodological limitations.",
                    tags=["neet", "india", "measurement", "youth", "synthetic"],
                ),
                EvidenceRecord(
                    title="Transition dynamics of NEET youth: Longitudinal evidence from panel surveys",
                    source_type="report",
                    authors="Synthetic Research Reference",
                    year=2025,
                    country="India",
                    population="Youth aged 15-24",
                    study_design="longitudinal",
                    quality_score=7.8,
                    evidence_grade="B",
                    abstract="Synthetic demonstration of longitudinal transition evidence tracking.",
                    key_results="Panel data reveals heterogeneous NEET persistence patterns across gender, geography, and education levels.",
                    policy_implications="Interventions should target persistent NEET populations rather than transient spells.",
                    tags=["transitions", "persistence", "longitudinal", "panel", "synthetic"],
                ),
                EvidenceRecord(
                    title="Skills training programmes and NEET exit rates: A comparative evaluation",
                    source_type="evaluation",
                    authors="Synthetic Research Reference",
                    year=2024,
                    country="India",
                    population="NEET youth aged 18-24",
                    study_design="quasi-experimental",
                    quality_score=7.2,
                    evidence_grade="C",
                    abstract="Synthetic evaluation evidence for the platform's intervention intelligence module.",
                    key_results="Vocational training combined with placement support shows higher transition rates than training alone.",
                    policy_implications="Programme design should integrate market linkages with skills training for maximum impact.",
                    tags=["skills", "training", "intervention", "evaluation", "synthetic"],
                ),
            ]
            for ev in evidence_entries:
                db.add(ev)
            db.commit()
            print(f"      Seeded {len(evidence_entries)} evidence records")
        else:
            print(f"      Evidence registry has {evidence_count} records")

        print("\n✅ Database initialization complete!")
        print(f"   Database location: {settings.DATABASE_URL}")
        print(f"   Admin login: admin@neet.platform / admin123")
        print(f"   Researcher login: researcher@neet.platform / research123")

    finally:
        db.close()


if __name__ == "__main__":
    init_database()
