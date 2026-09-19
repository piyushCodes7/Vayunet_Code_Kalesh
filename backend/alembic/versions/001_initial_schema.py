"""initial schema

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-09-20 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '001_initial_schema'
down_revision = None
branch_labels = None
depends_on = None

def upgrade() -> None:
    # 1. Sensors Table
    op.create_table(
        'sensors',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=120), nullable=False),
        sa.Column('lat', sa.Float(), nullable=False),
        sa.Column('lng', sa.Float(), nullable=False),
        sa.Column('type', sa.String(length=50), nullable=False, server_default='low_cost_optical'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_sensors_id'), 'sensors', ['id'], unique=False)

    # 2. Sensor Readings Table
    op.create_table(
        'sensor_readings',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('sensor_id', sa.Integer(), nullable=False),
        sa.Column('pm25', sa.Float(), nullable=False),
        sa.Column('pm10', sa.Float(), nullable=False),
        sa.Column('temperature', sa.Float(), nullable=True),
        sa.Column('humidity', sa.Float(), nullable=True),
        sa.Column('recorded_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['sensor_id'], ['sensors.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_sensor_readings_id'), 'sensor_readings', ['id'], unique=False)
    op.create_index(op.f('ix_sensor_readings_sensor_id'), 'sensor_readings', ['sensor_id'], unique=False)
    op.create_index(op.f('ix_sensor_readings_recorded_at'), 'sensor_readings', ['recorded_at'], unique=False)

    # 3. Locations Table
    op.create_table(
        'locations',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=150), nullable=False),
        sa.Column('type', sa.String(length=50), nullable=False),
        sa.Column('lat', sa.Float(), nullable=False),
        sa.Column('lng', sa.Float(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_locations_id'), 'locations', ['id'], unique=False)

    # 4. Predictions Table
    op.create_table(
        'predictions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('location_id', sa.Integer(), nullable=True),
        sa.Column('predicted_pm25', sa.Float(), nullable=False),
        sa.Column('predicted_pm10', sa.Float(), nullable=False),
        sa.Column('aqi', sa.Integer(), nullable=False),
        sa.Column('category', sa.String(length=50), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['location_id'], ['locations.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_predictions_id'), 'predictions', ['id'], unique=False)
    op.create_index(op.f('ix_predictions_location_id'), 'predictions', ['location_id'], unique=False)

    # 5. Advisories Table
    op.create_table(
        'advisories',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('location_id', sa.Integer(), nullable=True),
        sa.Column('context', sa.String(length=50), nullable=False),
        sa.Column('risk_level', sa.String(length=50), nullable=False),
        sa.Column('advisory_text', sa.Text(), nullable=False),
        sa.Column('generated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['location_id'], ['locations.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_advisories_id'), 'advisories', ['id'], unique=False)
    op.create_index(op.f('ix_advisories_location_id'), 'advisories', ['location_id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_advisories_location_id'), table_name='advisories')
    op.drop_index(op.f('ix_advisories_id'), table_name='advisories')
    op.drop_table('advisories')

    op.drop_index(op.f('ix_predictions_location_id'), table_name='predictions')
    op.drop_index(op.f('ix_predictions_id'), table_name='predictions')
    op.drop_table('predictions')

    op.drop_index(op.f('ix_locations_id'), table_name='locations')
    op.drop_table('locations')

    op.drop_index(op.f('ix_sensor_readings_recorded_at'), table_name='sensor_readings')
    op.drop_index(op.f('ix_sensor_readings_sensor_id'), table_name='sensor_readings')
    op.drop_index(op.f('ix_sensor_readings_id'), table_name='sensor_readings')
    op.drop_table('sensor_readings')

    op.drop_index(op.f('ix_sensors_id'), table_name='sensors')
    op.drop_table('sensors')
