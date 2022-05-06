export interface CameraImage {
  imageAsDataUrl: string;
  imageData: Blob;
}

export interface Cred {
  username: string;
  password: string;
}

export interface HttpRes {
  status: number;
  message: string;
}

export interface FoodForThought {
  title: string;
  comments: string;
  imageCheck: boolean;
  image: CameraImage;
  cred: Cred;
}
