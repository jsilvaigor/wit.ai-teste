'use strict';

let Wit = null;
let interactive = null;
try {
  // if running from repo
  Wit = require('./').Wit;
  interactive = require('./').interactive;
} catch (e) {
  Wit = require('node-wit').Wit;
  interactive = require('node-wit').interactive;
}

const accessToken = (() => {
  if (process.argv.length !== 3) {
    console.log('usage: node educacional.js <wit-access-token>');
    process.exit(1);
  }
  return process.argv[2];
})();

// Quickstart example
// See https://wit.ai/ar7hur/quickstart

const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value
  ;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};

const dados = {
  notas : ['30', '35', '40', '25', '33'],
  faltas : ['2', '5', '9', '0', '1', '8'],
  atividades: [
    'O GERENTE DE PROJETO E SUAS INTERFACES - GERÊNCIA DE PROJETOS ( SIN8D-S )',
    'Sistemas Especialistas: Expert Sinta - OPTATIVA (TÓPICOS ESPECIAIS EM SISTEMAS DE INFORMAÇÃO) ( SIN8D-S )',
    'APS Governo e Máquina Pública - EMPREENDEDORISMO E MARKETING ( SIN8D-S )',
    'APS Jeito brasileiro de criar empregos - EMPREENDEDORISMO E MARKETING ( SIN8D-S )',
    'Sábado Letivo Emp Sustenável - EMPREENDEDORISMO E MARKETING ( SIN8D-S )',
    'TP Wit.ai ChatBot - PROJETO INTEGRADOR VIII ( SIN8D-S )',
    'Bolsa de valores WebSocket - TÓPICOS ESPECIAIS III ( SIN8D-S )',
    'Algoritmos Genéticos  - OPTATIVA (TÓPICOS ESPECIAIS EM SISTEMAS DE INFORMAÇÃO) ( SIN8D-S )'
  ]
}

const funcoes = {
  random : (low, high) =>  Math.floor(Math.random() * (high - low) + low),
  randomSequence: (max, size) => {
    var arr = []
    while(arr.length < size){
        let randomnumber = Math.ceil(Math.random()*max -1)
        if(arr.indexOf(randomnumber) > -1) continue;
        arr[arr.length] = randomnumber;
    }
    return arr
  }
}

const actions = {
  send(request, response) {
    const {sessionId, context, entities} = request;
    const {text, quickreplies} = response;
    return new Promise(function(resolve, reject) {
      console.log('sending...', JSON.stringify(response));
      return resolve();
    });
  },
  fetchNotas({context, entities}) {
    return new Promise(function(resolve, reject) {
      var disciplina = firstEntityValue(entities, 'disciplina')
      if (disciplina) {
        let i = funcoes.random(0, dados.notas.length - 1);
        context.nota = dados.notas[i]
      } else {
        context.nota = 'sem notas'
      }
      return resolve(context);
    });
  },
  fetchFaltas({context, entities}) {
    return new Promise(function(resolve, reject) {
        let i = funcoes.random(0, dados.faltas.length - 1);
        context.faltas = dados.faltas[i]
      return resolve(context);
    });
  },
  fetchAtividades({context, entities}) {
    return new Promise(function(resolve, reject) {
        let intervalo = firstEntityValue(entities, 'intervalo')
        context.atividades = "";
        if(intervalo.includes('hoje')){

          context.atividades = dados.atividades[0]
        }else if (intervalo.includes('amanh')){
          let arr = [0,1]
          for (let i in arr) {
            context.atividades += ` ${dados.atividades[i]} \\`
          }
        } else if (intervalo.includes('semana')){
          let arr = [0,1,2,3]
          for (let i in arr) {
            context.atividades += ` ${dados.atividades[i]} \\`
          }
        } else if (intervalo.includes('mês') || intervalo.includes('mes')){
          let arr = [0,1,2,3,4,5]
          for (let i in arr) {
            context.atividades += ` ${dados.atividades[i]} \\`
          }

        } else if (intervalo.includes('ano')){
          let arr = [0,1,2,3,4,5, 6, 7]
          for (let i in arr) {
            context.atividades += ` ${dados.atividades[i]} \\`
          }

        } else {
          context.atividades = 'Nenhuma atividade'
        }


      return resolve(context);
    });
  }
};

const client = new Wit({accessToken, actions});
interactive(client);
