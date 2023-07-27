import * as tf from "@tensorflow/tfjs";
import { flood_level_dict } from "../utils/variables";

/**
 * 입력받은 이미지 태그 내의 이미지로 홍수 모델을 실행하고, 그 결과를 문자열로 반환하는 함수.
 * @param imageElement 모델을 실행할 이미지가 삽입되어있는 HTMLImageElement
 * @returns 결괏값 string("상" | "중" | "하" | "normal")을 담고 있는 Promise 객체. normal은 홍수가 아니다.
 */
export const getFloodResult = async (
  imageElement: HTMLImageElement
): Promise<string> => {
  try {
    // * Loading the Model
    const model = await tf.loadGraphModel(
      "http://127.0.0.1:3000/model/model.json"
    );
    console.log("Successfully loaded model");

    // * Image Processing
    const imgTensor = tf.browser
      // @ts-ignore
      .fromPixels(imageElement, 3)
      .toFloat();
    const resizedImg = tf.image.resizeNearestNeighbor(imgTensor, [224, 224]);
    const expandedImg = tf.expandDims(resizedImg, 0);

    // * Model Execution
    // @ts-ignore
    const output = model.execute(expandedImg);

    // * Model Result
    // @ts-ignore
    const predictions = tf.argMax(output, 1);
    const maxIndex = predictions.dataSync()[0];
    console.log("result index:", maxIndex);

    //@ts-ignore
    const result = flood_level_dict[maxIndex];

    return result;
  } catch (error) {
    console.error(error);
    return "";
  }
};
