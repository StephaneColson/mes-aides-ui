from openfisca_core.scripts import build_tax_benefit_system
from openfisca_web_api_preview.app import create_app

country_package = 'openfisca_france'
extensions = ['openfisca_paris', 'openfisca_brestmetropole', 'openfisca_rennesmetropole']

tax_benefit_system = build_tax_benefit_system(
    country_package_name = country_package,
    extensions = extensions,
    reforms = ['openfisca_france.reforms.simulation_reform.simulation_reform']
)

application = create_app(tax_benefit_system)
