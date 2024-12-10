// export class Pet {
//     constructor(breed, name,  age){
//         this.breed = breed;
//         this.name = name
//         this.age = age;
//         this.is_adopted = true;
//     }
//     printPet(){
//         if (this.is_adopted) {console.log(`${this.breed} ${this.name} счаслив со своим хозяином`)}
//         else {console.log(`${this.breed} ${this.name} ждёт своего хозяина`)}
//     }
// }

const PetNamespace = {
    id: null,
    name: null,
    age: null,

    printPet(){
        {console.log(`${this.name} счаслив со своим хозяином`)}
    }
}


//  main.js
 
//  GET request using fetch()


export default PetNamespace;
