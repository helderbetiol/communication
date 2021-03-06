import * as React from "react";

import styled from "styled-components";

import Scrollbars from "react-custom-scrollbars";

import { ContainerAdmin } from "./containerAdmin";

import { FOND_CACHE } from "../../bibliotheque/interface/couleur";
import { FormatUtilisateur, FormatConsigne, FormatPopulationLocale, FormatDomaine } from "../commun/echangesJeu1Distribution";
import { DomaineInterface } from "./typesInterface";

interface ProprietesAdmin {
  // see https://github.com/Microsoft/TypeScript/issues/8588
  className?: string;
  utilisateur: FormatUtilisateur;
  population: FormatPopulationLocale;
  consigne: FormatConsigne;
  domaine: DomaineInterface;
  domainesVoisins: ReadonlyArray<DomaineInterface>;
  selection: DomaineInterface;
  modifSelection: (d: DomaineInterface) => void;
}

class AdminBrut extends React.Component<ProprietesAdmin, {}> {
  render() {
    return (
      <div className={this.props.className}>
        <Scrollbars style={{ width: "24vw", height: "100vh" }}>
          <ContainerAdmin
            utilisateur={this.props.utilisateur}
            population={this.props.population}
            domaine={this.props.domaine}
            consigne={this.props.consigne}
            domainesVoisins={this.props.domainesVoisins}
            selection={this.props.selection}
            modifSelection={this.props.modifSelection} />
        </Scrollbars>
      </div>
    );
  }
}

export const Admin = styled(AdminBrut)`
    background: ${FOND_CACHE};
    position: fixed;
    top: 0;
    left: 0;
`;

