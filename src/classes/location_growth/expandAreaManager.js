import { ExpandAreaCircular } from "./expandAreaCircular";
import { ExpandAreaConnect } from "./expandAreaConnect";

const algorithms = [
    new ExpandAreaCircular(),
    new ExpandAreaConnect()
];

/**
 * Takes in a location and converts spaces around that location to its type.
 * Chooses randomly between different expand algorithms.
 * @param {*} location The location to expand out
 * @param {*} prevLocations List of locations that are already set
 * @returns List of locations the algorithm created.
 * @returns Array with only location in it if any params are undefined or if no suitable algorithm was found.
 */
export function expandArea(location, prevLocations, rng){
    if(!location || !prevLocations){
        return [];
    }

    const specificAlgorithm = algorithms[Math.floor(rng() * algorithms.length)];
    if(!specificAlgorithm){
        return [];
    }

    // return [location];
    return specificAlgorithm.runAlgorithm(location, prevLocations, rng);
}