import { CustomLogger } from '../../src/infrastructure/utils/log.utils';
import {Md5} from 'ts-md5';
import { MockUtils } from '../../src/infrastructure/utils/mock.utils';

const metadonnees = new MockUtils().metadonneesDtoMock
const requiredKeys = ['idJuridiction', 'numeroRegistre', 'numeroRoleGeneral', 'dateDecision']
const optionalKey = 'numeroMesureInstruction'
const logger = new CustomLogger

export function executeNormalization(metadonnees): void {
    if (hasMandatoryMetadonnees(metadonnees)) {      
        const uniqueMetadonnees = metadonnees.idJuridiction + 
                                  metadonnees.numeroRegistre + 
                                  metadonnees.numeroRoleGeneral + 
                                  metadonnees.dateDecision 
        
        const idMetadonnees = (optionalKey in metadonnees) ? uniqueMetadonnees + metadonnees.numeroMesureInstruction : uniqueMetadonnees

        // metadonnees.hash = Md5.hashStr(idMetadonnees) 
        metadonnees.hash = idMetadonnees
        logger.log('Normalization : added hash ' + metadonnees.hash + ' to metadata')
    }   
    else {
        logger.error('Normalization : could not add hash to metadata')
    }    
}

function hasMandatoryMetadonnees(metadonnees): boolean {
    for (const key of requiredKeys) {
        if (!(key in metadonnees)) {
            return false
        }
    }
    return true
}

executeNormalization(metadonnees)