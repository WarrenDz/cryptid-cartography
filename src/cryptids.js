import bigfootImage from './assets/bigfoot.jpeg';
import mothmanImage from './assets/mothman.jpeg';
import chupacabraImage from './assets/chupacabra.jpeg';
import champyImage from './assets/champy.jpeg';

const cryptids = {
    bigfoot: {
        name: 'Bigfoot',
        description: 'TEMP: Bigfoot, also commonly referred to as Sasquatch, is a large, hairy, mythical humanoid creature said to inhabit forests in North America, particularly in the Pacific Northwest. Bigfoot is featured in both American and Canadian folklore, and since the mid-20th century has become a cultural icon, permeating popular culture and becoming the subject of its own distinct subculture.',
        image: bigfootImage,
        hint1: 'bigfoot-hint1',
        hint2: 'bigfoot-hint2',
        latitude: 47.6062,
        longitude: -122.3321
    },
    mothman: {
        name: 'Mothman',
        description: 'TEMP: Mothman is a legendary winged creature said to haunt the forests and river valleys around Point Pleasant, West Virginia. Often described as having glowing red eyes and an unsettling presence, Mothman became famous after a series of reported sightings in the 1960s. In local lore, encounters with the creature are often seen as a warning that something unusual or significant is about to happen.',
        image: mothmanImage,
        hint1: 'mothman-hint1',
        hint2: 'mothman-hint2',
        latitude: 38.903831,
        longitude: -82.075155
    },
    chupacabra: {
        name: 'Chupacabra',
        description: 'TEMP: Chupacabra is a cryptid from Latin American folklore, most famously associated with Puerto Rico, Mexico, and the American Southwest. Described as a strange, nocturnal creature that attacks livestock, the Chupacabra earned its name, meaning "goat-sucker," from reports of animals found mysteriously drained of blood.',
        image: chupacabraImage,
        hint1: 'chupacabra-hint1',
        hint2: 'chupacabra-hint2',
        latitude: 19.664642,
        longitude: -97.484251
    },
    champy: {
        name: 'Lake Champlain Monster (Champy)',
        description: 'TEMP: Champ, the legendary Lake Champlain Monster, is said to inhabit the deep waters of Lake Champlain along the border of New York, Vermont, and Québec. Witnesses have described a long-necked, serpentine creature surfacing briefly before disappearing beneath the lake. For more than two centuries, reports of mysterious sightings have made Champ one of North America\'s most enduring lake monster legends.',
        image: champyImage,
        hint1: 'champy-hint1',
        hint2: 'champy-hint2',
        latitude: 44.305864,
        longitude: -73.324522 
    }
};

export default cryptids;