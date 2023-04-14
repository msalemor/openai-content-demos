import axios from "axios";
import { useState } from "react";
import { IDavinciPrompt, IProduct, ISettings } from "../interfaces";
import { getDavinciCompletion, getJson } from "../services";

enum ProcessingState {
  None,
  Loading,
  Loaded,
  Processing,
  Processed,
}

const Products = (props: { settings: ISettings }) => {
  // State
  const [products, setProducts] = useState<IProduct[]>([]);
  const [processing, setProcessing] = useState<ProcessingState>(
    ProcessingState.None
  );
  const [count, setCount] = useState(0);

  // Supporting functions
  const getProductDescription = (product: IProduct): string => {
    let description = `${product.make} ${product.model} ${product.color} for $${product.price}`;
    product.features.forEach((feature: string) => {
      description += ` with ${feature}`;
    });
    description += ` and ${product.warranty} warranty`;
    return description;
  };

  const onClear = () => {
    setCount(0);
    setProcessing(ProcessingState.None);
    setProducts([]);
  };

  const onLoad = async () => {
    //console.info("Loading products");
    let json: IProduct[] = await getJson("/data/electronics.json");
    //console.info(json);
    setProducts(json);
    setProcessing(ProcessingState.Loaded);
  };

  const onProcess = async () => {
    setProcessing(ProcessingState.Processing);
    setCount(products.length);

    console.info("Processing sales descriptions");

    // TODO: This is the code to use the GPT endpoint instead of Davinci
    // Doing this because I cannot send more than 1 request per second to ChatGPT
    // try {
    //   for (var i = 0; i < products.length; i++) {
    //     let product = products[i];
    //     let productDescription = getProductDescription(product);
    //     let messages: IChatMessage[] = [];
    //     messages.push({
    //       role: "system",
    //       content: "You are a general assistant",
    //     });
    //     messages.push({
    //       role: "user",
    //       content: "Get a sales description for " + productDescription,
    //     });
    //     let context = "";
    //     const temperature = 0.3;
    //     const max_tokens = 300;
    //     const n = 1;
    //     let options: IChatPrompt = {
    //       messages,
    //       context,
    //       temperature,
    //       max_tokens,
    //       n,
    //     };

    //     let resp = await getChatCompletion(options);
    //     const completion = resp?.choices[0].message.content;
    //     product.description = completion;
    //     console.info(completion);
    //     await sleep(900);
    //     let newCount = count - 1;
    //     setCount(i);
    //   }
    //   setProcessing(false);
    // } finally {
    //   setProcessing(false);
    // }

    // TODO: Using Davinci because GPT was throttling me to 1 req/sec
    products.forEach(async (product, idx) => {
      const productDescription = getProductDescription(product);
      const prompt = "Get a sales description for " + productDescription;
      const context = "";
      const temperature = parseFloat(props.settings.temperature);
      const max_tokens = parseInt(props.settings.max_tokens);
      const n = parseInt(props.settings.n);
      let requestPayload: IDavinciPrompt = {
        prompt,
        context,
        temperature,
        max_tokens,
        n,
      };
      console.info("Product Request");
      console.info(requestPayload);
      let resp = await getDavinciCompletion(requestPayload);
      console.info("Product Response");
      console.info(resp);
      product.description = resp?.choices[0].text;
      setCount(idx);
      if (idx === products.length - 1) {
        setProcessing(ProcessingState.Processed);
      }
    });

    console.info("Done processing sales descriptions");
  };

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  // Render
  return (
    <div className="App container">
      <h2>Product Description Generator</h2>
      <div className="mb-3">
        <button
          className="btn btn-primary"
          onClick={onLoad}
          disabled={processing !== ProcessingState.None}
        >
          Load
        </button>
        <button
          className="btn btn-success m-2"
          onClick={onProcess}
          disabled={!(processing === ProcessingState.Loaded)}
        >
          Process
        </button>
        <button className="btn btn-danger" onClick={onClear}>
          Clear
        </button>{" "}
      </div>

      {processing === ProcessingState.Loaded ? (
        <section className="product-table">
          <label className="mb-2">Product Table</label>
          <table className="table table-striped table-bordered">
            <thead className="bg-dark text-light">
              <tr>
                <th>Make</th>
                <th>Model</th>
                <th>Color</th>
                <th>Features</th>
                <th>Warranty</th>
                <th align="right">Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.make}</td>
                  <td>{product.model}</td>
                  <td>{product.color}</td>
                  <td>
                    {product.features.map((feature) => (
                      <div>{feature}</div>
                    ))}
                  </td>
                  <td>{product.warranty}</td>
                  <td align="right">{formatter.format(product.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}

      {processing === ProcessingState.Processing ||
      processing === ProcessingState.Processed ? (
        <section className="product-details">
          <label className="mb-2">Product Descriptions</label>
          <div>
            {products.map((product) => (
              <div className="card mb-3" key={product.id}>
                <div className="card-header bg-dark text-light fw-bold">
                  {product.make} {product.model} {product.color} for{" "}
                  {formatter.format(product.price)}
                </div>
                <div className="card-body bg-light">
                  <div className="row">
                    <div className="col-md-2">
                      <p className="fw-bold">Features:</p>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: product.features.join("<br/>"),
                        }}
                      />
                      <br />
                      &nbsp;
                    </div>
                    <div className="col-md-8">
                      <p className="fw-bold">Description:</p>
                      <p>{product.description}</p>
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <span className="fw-bold">Warranty:</span> {product.warranty}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default Products;
