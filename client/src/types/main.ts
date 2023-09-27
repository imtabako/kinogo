export type Film = {
  _id: string,
  name: string,
  description: string,
  year: number,
  alternativeName: string,
  movieLength: number,
  shortDescription: string,
  poster: string,
  rating:{
    kp: number,
    imdb: number
  },
  votes:{
    kp: number,
    imdb: number
  },
  watchability:[
    {
      logo: string,
      name: string,
      url: string
    }
  ]
}
