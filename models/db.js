const mongooes=require('mongoose');
module.exports.init = async function(){
   await 
   mongooes.connect('mongodb+srv://arpanguptaastro:jbSND6WKlTAYwDkg@cluster0.gquawpk.mongodb.net/HARHARSAMBHU?retryWrites=true&w=majority');
}