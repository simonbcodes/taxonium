# Taxonium

Taxonium is a client-side Javascript tool for exploring extremely large trees. It is currently used for Cov2Tree, a display of the global SARS-CoV-2 phylogeny: 🌳 http://cov2tree.org

The data and tree displayed in Cov2Tree are collated by the UShER team: http://hgdownload.soe.ucsc.edu/goldenPath/wuhCor1/UShER_SARS-CoV-2// . The sequences contained represent the work of thousands of researchers across the world.

Most of this repository is a client side React app that displays the tree. It loads the `public/nodelist.pb` file, which contains a pre-processed form of the data. The Python scripts that build this file are in `data_processing`, along with a little documentation.

## Using it for your own data

You can now generate Taxonium format files from [UShER](https://github.com/yatisht/usher/pull/134).

For datasets that aren't UShER-suited you would at the moment need to create your own `data_processing` directory, which is adapted to produce the `nodelist.pb` file from your own datasets. We will try to streamline this. Feel free to raise an Issue requesting help!

### Cloning the repo

For convenience we currently keep the trees checked into the repo. This makes the repo very big. But you can only check out the latest commits using.

```git clone --depth 1 https://github.com/theosanderson/taxonium```


## Structure

Taxonium now consists of a number of components:
* [taxoniumtools](./taxoniumtools/) - a Python package that lets you easily generate Taxonium files from Usher protobuf files
* [taxonium_web_client](./taxonium_web_client/) - the web client that is available at e.g. taxonium.org and let's you explore Taxonium files in your browser
* [taxonium_backend](./taxonium_backend/) - a server-based backend that allows Taxonium trees to be explored without the user downloading the full tree (N.B. Taxonium can also be used without this backend, with static files acccessed in taxonium_web_client)
* [taxonium_data_handling] - this is a node package upon which both the web client and the backend depend (it handles core logic common to both)

## Development instructions

```
nvm use 14
yarn install
yarn start
```
