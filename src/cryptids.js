import bigfootImage from './assets/bigfoot.jpeg';
import mothmanImage from './assets/mothman.jpeg';
import chupacabraImage from './assets/chupacabra.jpeg';
import champyImage from './assets/champy.jpeg';

const cryptids = {
    bigfoot: {
        name: 'Bigfoot',
        description: 'It’s none other than Bigfoot, also known as Sasquatch. The infamous film footage shot at this location captured a tall, hairy creature moving on two legs through the woods along a riverbank. Many cultures around the world have a similar legend of large, hairy, wild human-like beings, which perhaps helps to explain why Bigfoot became such a phenomenon in the U.S. Entire clubs are dedicated to proving the existence of Bigfoot, though they have yet to do so conclusively.',
        image: bigfootImage,
        hint1: 'bigfoot-hint1',
        hint2: 'bigfoot-hint2',
        latitude: 41.421376,
        longitude: -123.757542,
        threshold: 2000
    },
    mothman: {
        name: 'Mothman',
        description: 'Meet the Mothman, the most famous resident of Point Pleasant, West Virginia. It has been described as having a tall, slender, humanoid form, but with large wings and glowing red eyes. Though avian experts have chalked up numerous sightings over the years to various types of birds, the town fully leans into the legend. An annual Mothman Festival brings thousands of visitors to Point Pleasant — though its namesake has yet to grace the event with its presence.',
        image: mothmanImage,
        hint1: 'mothman-hint1',
        hint2: 'mothman-hint2',
        latitude: 38.903831,
        longitude: -82.075155,
        threshold: 250
    },
    chupacabra: {
        name: 'Chupacabra',
        description: 'This pesky critter is the Chupacabra. Descriptions vary based on region. In the Southwestern United States, sightings most often take the form of a hairless, dog-like creature with large fangs. Much evidence — including purported Chupacabra corpses — suggests mangy coyotes infected with a certain parasite are responsible for so-called Chupacabra sightings.',
        image: chupacabraImage,
        hint1: 'chupacabra-hint1',
        hint2: 'chupacabra-hint2',
        latitude: 30.537272,
        longitude: -100.236945,
        threshold: 25000
    },
    champy: {
        name: 'Lake Champlain Monster (Champy)',
        description: 'This is the one and only Champy, named for its home in Lake Champlain. The mystery was rekindled in 2024 when a film crew on the lake saw a dark shape following their boat on drone footage. An academic and scientific panel has been reviewing the video and is planning to release its findings in late 2026.',
        image: champyImage,
        hint1: 'champy-hint1',
        hint2: 'champy-hint2',
        latitude: 44.305864,
        longitude: -73.324522,
        threshold: 1500
    }
};

export default cryptids;