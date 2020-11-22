import { Component, OnChanges, OnInit, SimpleChanges, OnDestroy } from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit, OnChanges, OnDestroy{

  texto = 'Para poder tocar o instrumento, você precisa acompanhar brevemente as instruções contidas neste texto.... Na aba do Instrumento, você poderá decidir as notas, que será através de giros no seu celular... Imagine que seu celular está girando no meio de uma cruz do tamanho dele... Imaginou? pronto... Agora, vamos às explicações das lógicas das oitavas... Primeiro Sempre que você girar acima do braço esquerdo da cruz, você estará emitind notas com duração de uma segunda oitava. Segundo Sempre que você girar abaixo do braço esquerdo da cruz, você estará emitind notas com duração de uma quarta oitava Terceiro Sempre que você girar acima do braço direito da cruz, você estará emitind notas com duração de uma sexta oitava Quarto Sempre que você girar abaixo do braço direito da cruz, você estará emitind notas com duração de uma oitava Huuuummm, espero que você tenha entendido Espero que você tenha entendido a lógica das oitavas! Agora, vamos a explicação das notas Sempre que você estiver em uma das posições que explicamos anteriormente nas oitavas da esquerda para direita, você vai emitir uma nota, de DÓ, para SI. Então, fique bem atento as posições das notas, pois elas seguem um padrão de posicionamento No Final, quando quiser tocar o acorde com a música gerada a partir dos giros, é só clicar no botão Parar e Tocar!';

  constructor(private tts: TextToSpeech) {}

  ngOnInit(): void {
    this.tts.speak({text: this.texto, locale: 'pt-BR'})
    .then(() => console.log('Success'))
    .catch((reason: any) => console.log(reason));
  }

  ngOnChanges(): void {
    this.tts.speak({text: this.texto, locale: 'pt-BR'})
    .then(() => console.log('Success'))
    .catch((reason: any) => console.log(reason));
  }

  ngOnDestroy(): void {
    this.tts.stop().then(() => console.log('Stopped'))
    .catch((reason: any) => console.log(reason));
  }

}
