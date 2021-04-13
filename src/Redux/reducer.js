import { LOGIN_USER, LOGOUT_USER } from './actions';
import { user, authenticated, posts } from './states'

export let reducer = (state = { user, authenticated, posts }, action) => {
    switch(action.type){
        case LOGIN_USER:
            return { 
                ...state,
                user: {
                    ...action.user,
                    username: action.user.username,
                    firstName: 'John',
                    lastName: 'Smith',
                    email: 'johnsmith@me.com',
                    description: 'I am a dull person',
                    posts: [
                        'https://instagram.fphx1-1.fna.fbcdn.net/v/t51.2885-15/e35/s1080x1080/118824835_752102178682317_8673046612174740959_n.jpg?tp=1&_nc_ht=instagram.fphx1-1.fna.fbcdn.net&_nc_cat=109&_nc_ohc=BGDO5TOKrPEAX_PYAIr&edm=AABBvjUAAAAA&ccb=7-4&oh=cb17c611e0431a668ebffd22d6426c7b&oe=609B43B5&_nc_sid=83d603',
                        'https://instagram.fphx1-1.fna.fbcdn.net/v/t51.2885-15/e35/22069518_1951451185137575_6854561976698273792_n.jpg?tp=1&_nc_ht=instagram.fphx1-1.fna.fbcdn.net&_nc_cat=111&_nc_ohc=_5_iCKUYQiMAX8QQKXW&edm=AABBvjUAAAAA&ccb=7-4&oh=7b77c21bad60724f4501a3c3cf57d599&oe=609A87FC&_nc_sid=83d603',
                        'https://instagram.fphx1-1.fna.fbcdn.net/v/t51.2885-15/e35/18723523_316242025479585_967380910284472320_n.jpg?tp=1&_nc_ht=instagram.fphx1-1.fna.fbcdn.net&_nc_cat=109&_nc_ohc=IDIBFknkq7EAX--vkZc&edm=AABBvjUAAAAA&ccb=7-4&oh=132bc82c611f71d4709a38143bf154f4&oe=609A4088&_nc_sid=83d603',
                        'https://instagram.fphx1-1.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/s640x640/17663095_125615914648485_6244701329613127680_n.jpg?tp=1&_nc_ht=instagram.fphx1-1.fna.fbcdn.net&_nc_cat=109&_nc_ohc=jpb0d7FDZlUAX88KpJk&edm=AP_V10EAAAAA&ccb=7-4&oh=5ac749e7d71a64003df280f052301916&oe=609BFDD5&_nc_sid=4f375e',
                        'https://instagram.fphx1-1.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/s640x640/17931746_157472238114068_8492441269627256832_n.jpg?tp=1&_nc_ht=instagram.fphx1-1.fna.fbcdn.net&_nc_cat=108&_nc_ohc=Mug9hD11PHkAX_AA63q&edm=AP_V10EAAAAA&ccb=7-4&oh=7ca2243345cfec63ecb297a5dfc26585&oe=609C0CAB&_nc_sid=4f375e',
                        'https://instagram.fphx1-2.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/s640x640/16465848_202299403582048_7472338450373410816_n.jpg?tp=1&_nc_ht=instagram.fphx1-2.fna.fbcdn.net&_nc_cat=104&_nc_ohc=UNdvgDhPdTgAX_bEMof&edm=AP_V10EAAAAA&ccb=7-4&oh=3e2ecbbd2e9abe8b7eceb56c0c5833de&oe=609A9674&_nc_sid=4f375e',
                        'https://instagram.fphx1-2.fna.fbcdn.net/v/t51.2885-15/e15/1168414_1465523300341729_1559255136_n.jpg?tp=1&_nc_ht=instagram.fphx1-2.fna.fbcdn.net&_nc_cat=101&_nc_ohc=R0hjavUli7cAX-uUmXJ&edm=AP_V10EAAAAA&ccb=7-4&oh=19ce9c385d3baef650060e73320638b1&oe=6099B699&_nc_sid=4f375e',
                        'https://instagram.fphx1-1.fna.fbcdn.net/v/t51.2885-15/e15/11373526_1438130183173555_459219262_n.jpg?tp=1&_nc_ht=instagram.fphx1-1.fna.fbcdn.net&_nc_cat=107&_nc_ohc=ty0em6VNU6UAX-leVHB&edm=AP_V10EAAAAA&ccb=7-4&oh=ecbcee9cc1e03b95fd3142a720c962fa&oe=609CB95E&_nc_sid=4f375e',
                    ],
                    followers: ['q','w','e','a','s','t','u','y','i','p','o'],
                    following: ['q','w','e','a','s','t','u','y','p','o'],
                },
                authenticated: true,
            }
        case LOGOUT_USER:
            return { 
                ...state,
                user: {
                },
                authenticated: false,
            }
        default:
            return {...state};
    }
}