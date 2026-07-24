import bigfootImage from './assets/bigfoot.jpeg';
import chupacabraImage from './assets/chupacabra.jpeg';

const cryptids = {
    bigfoot: {
        name: 'Bigfoot',
        description: 'Bigfoot, also commonly referred to as Sasquatch, is a large, hairy, mythical humanoid creature said to inhabit forests in North America, particularly in the Pacific Northwest. Bigfoot is featured in both American and Canadian folklore, and since the mid-20th century has become a cultural icon, permeating popular culture and becoming the subject of its own distinct subculture.',
        image: bigfootImage,
        hint1: 'Bigfoot-hint1',
        hint2: 'Bigfoot-hint2',
        latitude: 47.6062,
        longitude: -122.3321
    },
    chupacabra: {
        name: 'Chupacabra',
        description: 'The Chupacabra is a legendary creature in the folklore of parts of the Americas, with its first purported sightings reported in Puerto Rico. The name comes from the animal\'s reported habit of attacking and drinking the blood of livestock, especially goats. The first reported sightings were in Puerto Rico, where it was described as a heavy creature, roughly the size of a small bear, with a row of spines reaching from the neck to the base of the tail.',
        image: chupacabraImage,
        hint1: 'Chupacabra-hint1',
        hint2: 'Chupacabra-hint2',
        latitude: 18.2208,
        longitude: -66.5901
    }
};

export default cryptids;