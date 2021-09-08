
precision mediump float;

varying vec2 tCoords;

uniform float uTypeMode;
uniform float uTransp;
uniform sampler2D uSampler;
uniform float uBorne1;
uniform float uBorne2;
uniform float uBorne3;
uniform float uBorne4;
uniform float uAffichCol1;
uniform float uAffichCol2;
uniform float uAffichCol3;
uniform float uAffichCol4;
uniform float uAffichCol5;
uniform float uBorneTransfMin;
uniform float uBorneTransfMax;

void main(void) {

    vec4 texture = texture2D(uSampler, vec2(tCoords.s, tCoords.t));

    //on récupère la valeur d'intensité de la texture en additionnant les 3 couleurs
    float intensite=texture[0]+texture[1]+texture[2];

    //on ramène l'intensité qui est entre 0 et 3 à un interval entre 0 et 1. c'est le niveau de gris qu'on utilisera
    float nivGris = intensite/3.0;

    //si le type d'affichage est en niveau de gris on ajoute dans les valeurs rgb le niveau de gris
    if(uTypeMode == 0.0){
    //si l'intensité est inferieur à 0.1 on considère que c'est du bruit et on le rend transparent
        if(intensite<0.1){
            texture[3]=0.0;
        }
        else{
            texture[0] = nivGris;
            texture[1] = nivGris;
            texture[2] = nivGris;
            texture[3]=uTransp;}
		
        }

    //si le type d'affichage est en fausses couleurs on affiche une couleur qui dépend de l'intensité
    else if(uTypeMode==1.0){
        if(intensite<0.1){
            texture[3]=0.0;
        }
		//si l'intensité est inférieure à la 1ière borne, on affiche en violet
		else if(intensite<uBorne1){
			//on affiche ou pas la couleur si l'utilisateur a coché la couleur ou non
			if(uAffichCol1 == 1.0){
			    texture[3]=uTransp;
			    texture[0] = 0.7;
			    texture[1] = 0.0;
			    texture[2] = 1.0;
			}
			else{
			    texture[3]=0.0;
	        }
        }
		//si l'intensite est inférieure à la 2ième borne, on affiche en bleu
		else if(intensite<uBorne2){
			if(uAffichCol2 == 1.0){
				texture[3]=uTransp;
				texture[0] = 0.0 ;
				texture[1] = 0.0 ;
				texture[2] = 1.0 ;
			}
			else{
				texture[3]=0.0;
			}
		}
		//si l'intensité est inférieure à la 3ième borne, on affiche en jaune
		else if(intensite<uBorne3){
		    if(uAffichCol3 == 1.0){
				texture[3]=uTransp;
			    texture[0] = 1.0;
			    texture[1] = 0.8;
			    texture[2] = 0.2;
			}
			else{
				texture[3]=0.0;
			}
		}
		//si l'intensité est inférieure à la 4ième borne, on affiche en orange
		else if(intensite<=uBorne4){
		    if(uAffichCol4 == 1.0){
			    texture[3]=uTransp;
			    texture[0] = 1.0;
			    texture[1] = 0.6;
			    texture[2] = 0.2;
			}
			else{
			    texture[3]=0.0;
			}
		}
		//si l'intensité est inférieure à l'intensité max (3.0), on affiche en rouge
		else if(intensite<=3.0){
			if(uAffichCol5 == 1.0){
			    texture[3]=uTransp;
			    texture[0] = 1.0;
				texture[1] = 0.0;
				texture[2] = 0.0;
			}
			else{
			    texture[3]=0.0;
			}
		}
    }
    //                                                           transparence
    //                                                                 |                          /|\
    //                                                                 |                        /  |  \
    //                                                                 |                      /    |    \
    //                                                                 |                    /      |      \
    //                                                                 |                  /        |        \
    //                                                                 |                /          |          \
    //                                                                 |              /            |            \
    //                                                                 |            /              |              \
    //si on choisi le type fonction de transfert                       ___________/________________|________________\_______| intensité
    //on affiche la transparence en fonction de la courbe suivante:    0.0      min               mid               max    3.0
    else if(uTypeMode==2.0){

        nivGris = intensite/3.0;

        float mid = (uBorneTransfMax-uBorneTransfMin)/2.0;

        if(intensite<0.1){
            texture[3]=0.0;
        }
        else{

            if ( nivGris<uBorneTransfMin){
               texture[3] = 0.0;
            }

            else if ( nivGris<=mid && nivGris >uBorneTransfMin){
                 texture[3] = ((nivGris-uBorneTransfMin)/(mid-uBorneTransfMin))*uTransp;
            }

            else if (nivGris>mid && nivGris <= uBorneTransfMax){
                texture[3] = ((nivGris-mid)/(uBorneTransfMax-mid))*uTransp;
            }
			
            else if ( nivGris>uBorneTransfMax){
                texture[3] = 0.0;
            }

            texture[0] = nivGris;
            texture[1] = nivGris;
            texture[2] = nivGris;

        }

    }


    gl_FragColor = texture;
	
}

