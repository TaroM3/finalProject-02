import productModel from "../model/product.model.js";

export default class ProductManager {
    constructor() {
        this.SORT_VALUES = {
            asc: { price: 1 },
            desc: { price: -1 },
            default: {},
        };

        this.AVAILABILITY = {
            true: { stock: { $gt: 0 } },
            false: { stock: { $lt: 1 } }
        }
        this.QUERY_VALUES = {
            food: { category: 'Food' },
            drama: { category: 'Drama' },
            documentary: { category: 'Documentary' },
            comedy: { category: 'Comedy' },
            books: { category: 'Books' },
            action: { category: 'Action' },
            horror: { category: 'Horror' },
            true: { stock: { $gt: 0 } },
            false: { stock: { $lt: 1 } },
            default: {}
        };
    }



    productPaginate = async (sortQ, page, limit, query) => {
        if (!limit) limit = 3;
        if (!page) page = 1;
        let sort = this.SORT_VALUES[this.sortStringValidator(sortQ)];

        let options = {
            sort: sort,
            page: page,
            limit: limit,
            lean: true,
        };
        // let string3 = String(query)
        // console.log(string3.length)
        let queryValue = this.categoryStringValidator(query)
        let queryR = this.QUERY_VALUES[queryValue]
        console.log(queryR);
        const products = await productModel.paginate(queryR, options);

        const result = {
            status: "success",
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage
                ? "products?query=" +
                query +
                "&limit=" +
                options.limit +
                "&sort=" +
                sortQ +
                "&page=" +
                products.prevPage
                : null,
            nextLink: products.hasNextPage
                ? "products?query=" +
                query +
                "&limit=" +
                options.limit +
                "&sort=" +
                sortQ +
                "&page=" +
                products.nextPage
                : null,
        };
        console.log(result)

        return result;
    };


    categoryStringValidator = (param) => {

        let string = String(param)
        let strLength = string.length
        console.log(string.length)

        const arrayString = [
            'food',
            'drama',
            'documentary',
            'comedy',
            'books',
            'action',
            'horror',
            'true',
            'false'
        ];
        const result = arrayString.find((e) => { if (string.match(e) && strLength == (e.length + 2)) { return e } });
        if (result === undefined) {
            return 'default';
        }
        console.log(result)
        return result.toString();
    }

    //Get param in a variable and validates the value and return a string {'asc', 'desc', 'default'} 
    sortStringValidator = (param) => {

        let string = String(param)
        // console.log(string.length)
        if (param.match('asc') && string.length === 5 ) {
            return 'asc';
        } else if (param.match('desc') && string.length === 6) {
            return 'desc';
        } else {
            return 'default';
        }
    };

}