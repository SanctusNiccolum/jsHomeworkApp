import PetNamespace from "./pets.js";
// export class PetShelder {
//     constructor(){
//         this.pets = []
//     }

//     addAnimal(animal){
//         this.pets.push(animal);
//         console.log(`${animal.breed} ${animal.name} попала в приют и ждёт своего хозяина :(((((`);
//     }
//     adoptAnimal(animal){
//         if (this.pets.includes(animal)){
//             this.pets = this.pets.filter(pet => pet != animal);
//             animal.is_adopted = false;
//             console.log(`${animal.breed} ${animal.name} нашёл хозяина:)`);
//         } else {
//             console.log(`в приюте нет такого животного`);
//         }
//     }
//     printAllAnimal(){
//         return this.pets;
//     }
// }

const PetShelderNamespace = {
    pets: [],

    addAnimal(animal){
        this.pets.push(animal);
        console.log(`${animal} попал в приют и ждёт своего хозяина :(((((`);
    },

    adoptAnimal(animal){
        if (this.pets.includes(animal)){
            this.pets = this.pets.filter(pet => pet != animal);
        console.log(`${animal} нашёл хозяина:)`);
        } else {
            console.log(`в приюте нет такого животного`);
        }
    },

    printAllPets(){
        return this.pets;
    }

}

export default PetShelderNamespace;