export type Product={
    id?:string;
    id_categoria:string;
    name:string; 
    price:number;
    description:string;
    quantity:number;
    img:string;
}

export type AddProdcutDTO={
  id_categoria: string;
  name: string;
  price: number;
  description: string;
  quantity: number;
  img?: string;
}

export type OptionalProductDTO={
    name:string;
}
