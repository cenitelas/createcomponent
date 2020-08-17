import React from 'react';
import axios from 'axios';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Input, ErrorMessage } from './components/common/forms';
import { emailYupValidation, nameYupValidation, cityYupValidation, phoneYupValidation } from './validations'
import InputMask from 'react-input-mask'
import './App.css';

/* Local types & constants
============================================================================= */

const INITIAL_VALUES = {
    name: "",
    phone: "",
    email: "",
    city: "",
};

const VALIDATION_SCHEMA = Yup.object().shape({
    name: nameYupValidation,
    phone: phoneYupValidation,
    email: emailYupValidation,
    city: cityYupValidation,
});

const API_URL = "http://vs-dev/wp-admin/admin-ajax.php";
export const API = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});


export const getPriceFrame = () =>
    API.get(`?action=price_frame`);

const App = () => {
    const [url, setUrl] = React.useState('');
    const [products, setProducts] = React.useState([]);
    const [praceFrame, setpraceFrameData] = React.useState(null);
    const [city, setCity] = React.useState('lipetsk');
    const [isShown, setIsShown] = React.useState(false);

    React.useEffect( () => {
        async function fetchData() {
            const praceFrameSettings = await getPriceFrame();
            setpraceFrameData(praceFrameSettings)
        }

        fetchData();
    }, [])

    const  getProduct = (productUrl) => {
        axios.post("http://remove-parser/public/handlers/parser-main.php", { productUrl })
            .then(({ data }) => {
                const newProduct = data;
                const _products = [...products];

                let _product = _products.find(product => product.id === data.id);

                if (_product) {
                    _product.num += 1;
                    setProducts([..._products]);
                } else {
                    newProduct.num = 1;
                    setProducts([newProduct, ...products]);
                }
                setUrl("");
            });
    }

    function changeNum(value, key) {
        const _products = [...products];
        if ((_products[key].num + value) > 999 || (_products[key].num + value) <= 0) return;
        _products[key].num += value;
        setProducts(_products);
    }

    function deletProduct(key) {
        const _products = [...products];
        _products.splice(key, 1);
        setProducts([..._products]);
    }

    let totalPrice = 0;
    let productsList = products.map((product, key) => {
        totalPrice += parseInt(product.price) * product.num;
        return (
            <div className="columns">
                <div className="column left">
                    <figure className="image">
                        <img src={product.previewImage} alt="uu"/>
                    </figure>
                </div>
                <div className="column right">
                    <div className="i-wrapp">
                        <p className="vs-product-title">Наименование товара:<span className="vs-value">{product.name}</span></p>
                        <div className="vs-wrapp-product-desc">
                            <p className="d-txt">Описание товара:</p>
                            <div className="td-container">
                                <div className="vs-product-decription" id="main-desc-product-txt">{product.description}</div>
                            </div>
                            <p className="vs-product-price">Стоимость товара:<span className="vs-value">{parseInt(product.price) * product.num} {product.currency}</span></p>
                        </div>
                    </div>
                    <div className="calculator_productList_product_action">
                        <div className="calculator_productList_product_action_delete" onClick={() => deletProduct(key)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM8 9H16V19H8V9ZM15.5 4L14.5 3H9.5L8.5 4H5V6H19V4H15.5Z" fill="black" />
                            </svg>
                        </div>
                        <div className="calculator_productList_product_action_quantity">
                            <div className="calculator_productList_product_action_quantity_minus" onClick={() => changeNum(-1, key)}>
                                -
                            </div>
                            <div className="calculator_productList_product_action_quantity_value">
                                {product.num}
                            </div>
                            <div className="calculator_productList_product_action_quantity_plus" onClick={() => changeNum(1, key)}>
                                +
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    });
    const getDeliverySum = () => {
        // получаем суммы купленых товаров Antikris
        let  price_frame_atnikris_sum_one = praceFrame.data['atnikris_min_five_thousand'];
        let  price_frame_atnikris_sum_two = praceFrame.data['atnikris_min_fifteen_thousand'];
        let  price_frame_atnikris_sum_three = praceFrame.data['atnikris_min_fifty_thousand'];
        // получаем коэффициенты доставки Antikris
        let  coff_price_frame_atnikris_sum_one = praceFrame.data['coff_atnikris_min_five_thousand'];
        let  coff_price_frame_atnikris_sum_two = praceFrame.data['coff_atnikris_min_fifteen_thousand'];
        let  coff_price_frame_atnikris_sum_three = praceFrame.data['coff_atnikris_min_fifty_thousand'];
        let  coff_price_frame_atnikris_sum_four = praceFrame.data['coff_atnikris_min_fifty_thousand'];
        // получаем суммы купленых товаров Липецк
        let  price_frame_lipeck_sum_one = praceFrame.data['price_frame_lipeck_sum_one'];
        let  price_frame_lipeck_sum_two = praceFrame.data['price_frame_lipeck_sum_two'];
        let  price_frame_lipeck_sum_three = praceFrame.data['price_frame_lipeck_sum_three'];
        let  price_frame_lipeck_sum_four = praceFrame.data['price_frame_lipeck_sum_four'];
        let  price_frame_lipeck_sum_five = praceFrame.data['price_frame_lipeck_sum_five'];
        let  price_frame_lipeck_sum_six = praceFrame.data['price_frame_lipeck_sum_six'];
        let  price_frame_lipeck_sum_seven = praceFrame.data['price_frame_lipeck_sum_seven'];
        let  price_frame_lipeck_sum_eight = praceFrame.data['price_frame_lipeck_sum_eight'];
        // получаем коэффициенты доставки Липецк
        let  coff_price_frame_lipeck_sum_one = praceFrame.data['coff_price_frame_lipeck_sum_one'];
        let  coff_price_frame_lipeck_sum_two = praceFrame.data['coff_price_frame_lipeck_sum_two'];
        let  coff_price_frame_lipeck_sum_three = praceFrame.data['coff_price_frame_lipeck_sum_three'];
        let  coff_price_frame_lipeck_sum_four = praceFrame.data['coff_price_frame_lipeck_sum_four'];
        let  coff_price_frame_lipeck_sum_five = praceFrame.data['coff_price_frame_lipeck_sum_five'];
        let  coff_price_frame_lipeck_sum_six = praceFrame.data['coff_price_frame_lipeck_sum_six'];
        let  coff_price_frame_lipeck_sum_seven = praceFrame.data['coff_price_frame_lipeck_sum_seven'];
        let  coff_price_frame_lipeck_sum_eight = praceFrame.data['coff_price_frame_lipeck_sum_eight'];
        let  coff_price_frame_lipeck_sum_nine = praceFrame.data['coff_price_frame_lipeck_sum_nine'];
        // получаем суммы купленых товаров Елец
        let  price_frame_elec_sum_one = praceFrame.data['price_frame_elec_sum_one'];
        let  price_frame_elec_sum_two = praceFrame.data['price_frame_elec_sum_two'];
        let  price_frame_elec_sum_three = praceFrame.data['price_frame_elec_sum_three'];
        let  price_frame_elec_sum_four = praceFrame.data['price_frame_elec_sum_four'];
        let  price_frame_elec_sum_five = praceFrame.data['price_frame_elec_sum_five'];
        let  price_frame_elec_sum_six = praceFrame.data['price_frame_elec_sum_six'];
        let  price_frame_elec_sum_seven = praceFrame.data['price_frame_elec_sum_seven'];
        let  price_frame_elec_sum_eight = praceFrame.data['price_frame_elec_sum_eight'];
        // получаем коэффициенты доставки Елец
        let  coff_price_frame_elec_sum_one = praceFrame.data['coff_price_frame_elec_sum_one'];
        let  coff_price_frame_elec_sum_two = praceFrame.data['coff_price_frame_elec_sum_two'];
        let  coff_price_frame_elec_sum_three = praceFrame.data['coff_price_frame_elec_sum_three'];
        let  coff_price_frame_elec_sum_four = praceFrame.data['coff_price_frame_elec_sum_four'];
        let  coff_price_frame_elec_sum_five = praceFrame.data['coff_price_frame_elec_sum_five'];
        let  coff_price_frame_elec_sum_six = praceFrame.data['coff_price_frame_elec_sum_six'];
        let  coff_price_frame_elec_sum_seven = praceFrame.data['coff_price_frame_elec_sum_seven'];
        let  coff_price_frame_elec_sum_eight = praceFrame.data['coff_price_frame_elec_sum_eight'];
        let  coff_price_frame_elec_sum_nine = praceFrame.data['coff_price_frame_elec_sum_nine'];
        //получаем коэффициент по умолчанию для всей ценовой сетки доставки
        let  coff_price_all_default = praceFrame.data['coff_price_all_default'];


        switch (document.getElementsByClassName('citySelect').length <= 0 ? document.getElementById("calculator").className : city) {
            case 'antikris':
                if (totalPrice <= price_frame_atnikris_sum_one) return parseInt(coff_price_frame_atnikris_sum_one * totalPrice)
                else if (totalPrice <= price_frame_atnikris_sum_two) return parseInt(coff_price_frame_atnikris_sum_two * totalPrice)
                else if (totalPrice <= price_frame_atnikris_sum_three) return parseInt(coff_price_frame_atnikris_sum_three * totalPrice)
                else return parseInt(coff_price_frame_atnikris_sum_four * totalPrice);
            case 'lipetsk':
                if (totalPrice <= price_frame_lipeck_sum_one) return parseInt(coff_price_frame_lipeck_sum_one * totalPrice)
                else if (totalPrice <= price_frame_lipeck_sum_two) return parseInt(coff_price_frame_lipeck_sum_two * totalPrice)
                else if (totalPrice <= price_frame_lipeck_sum_three) return parseInt(coff_price_frame_lipeck_sum_three * totalPrice)
                else if (totalPrice <= price_frame_lipeck_sum_four) return parseInt(coff_price_frame_lipeck_sum_four * totalPrice)
                else if (totalPrice <= price_frame_lipeck_sum_five) return parseInt(coff_price_frame_lipeck_sum_five * totalPrice)
                else if (totalPrice <= price_frame_lipeck_sum_six) return parseInt(coff_price_frame_lipeck_sum_six * totalPrice)
                else if (totalPrice <= price_frame_lipeck_sum_seven) return parseInt(coff_price_frame_lipeck_sum_seven * totalPrice)
                else if (totalPrice <= price_frame_lipeck_sum_eight) return parseInt(coff_price_frame_lipeck_sum_eight * totalPrice)
                else return parseInt(coff_price_frame_lipeck_sum_nine * totalPrice);
            case 'elets':
                if (totalPrice <= price_frame_elec_sum_one) return parseInt(coff_price_frame_elec_sum_one * totalPrice)
                else if (totalPrice <= price_frame_elec_sum_two) return parseInt(coff_price_frame_elec_sum_two * totalPrice)
                else if (totalPrice <= price_frame_elec_sum_three) return parseInt(coff_price_frame_elec_sum_three * totalPrice)
                else if (totalPrice <= price_frame_elec_sum_four) return parseInt(coff_price_frame_elec_sum_four * totalPrice)
                else if (totalPrice <= price_frame_elec_sum_five) return parseInt(coff_price_frame_elec_sum_five * totalPrice)
                else if (totalPrice <= price_frame_elec_sum_six) return parseInt(coff_price_frame_elec_sum_six * totalPrice)
                else if (totalPrice <= price_frame_elec_sum_seven) return parseInt(coff_price_frame_elec_sum_seven * totalPrice)
                else if (totalPrice <= price_frame_elec_sum_eight) return parseInt(coff_price_frame_elec_sum_eight * totalPrice)
                else return parseInt(coff_price_frame_elec_sum_nine * totalPrice);
            default:
                return parseInt(coff_price_all_default * totalPrice);
        }
    }


    const handleSubmit = (values, resetForm) => {
        const  { email, phone, name, city } = values;

        if (products.length <= 0) return;

        axios
            .post("http://remove-parser/public/handlers/mail.php", {
                data: {
                    products,
                    sum: totalPrice,
                    delivery: getDeliverySum(),
                    mail: email,
                    phone,
                    name,
                },
            })
            .then(() => {
                axios
                    .post("http://remove-parser/public/handlers/mailAdmin.php", {
                        data: {
                            products,
                            sum: totalPrice,
                            delivery: getDeliverySum(),
                            mail: email,
                            phone,
                            name,
                            town: city,
                        },
                    })
                    .then((r) => {
                        setProducts([]);

                        setIsShown(false);
                        resetForm(INITIAL_VALUES);

                        alert("Ваша заявка отправлена! Проверьте Ваш email!");
                    });
            });
    };

    return (
        <React.Fragment>
            <div className="container">
                <h2 className="calc-title title has-text-centered">
                    рассчитайте стоимость доставки
                </h2>
                <div className="form-calc-wrapper">
                    <div className="citySelect select">
                        <select value={city} onChange={(e) => setCity(e.target.value)}>
                            <option value="lipetsk">Липецк</option>
                            <option value="elets">Елец</option>
                        </select>
                    </div>
                    <input
                        type="text"
                        className="link-input input"
                        id="link-input"
                        placeholder="Вставьте ссылку на товар"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                    <div className="calc-btn-wrapp">
                        <button id="parser-start-btn" onClick={() => getProduct(url)}>
                            Рассчитать
                        </button>
                    </div>
                </div>
            </div>
            <div className="calculator container">
                {productsList.length > 0 ? (
                    <React.Fragment>
                        <div className="calculator_productList">{productsList}</div>
                        <div className="calculator_addProduct">
                            <h1 className="calculator_addProduct_totalPrice">
                                Итого: {totalPrice} RUB
                            </h1>
                            <h2 className="calculator_addProduct_deliveryPrice">
                                Стоимость доставки: {getDeliverySum()} RUB
                            </h2>
                            <button
                                className="calculator_addProduct_confirmOrder"
                                onClick={() => setIsShown(true)}
                            >
                                Оформить заказ
                            </button>
                        </div>

                        <Formik
                            initialValues={INITIAL_VALUES}
                            onSubmit={handleSubmit}
                            validationSchema={VALIDATION_SCHEMA}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <div
                                        className={
                                            "calculator_openWindow_background" +
                                            (isShown ? " calculator_openWindow_background-show" : "")
                                        }
                                    >
                                        <div className="calculator_openWindow">
                                            <div className="calculator_openWindow_content">
                                                <div
                                                    className="calculator_openWindow_close"
                                                    onClick={() => setIsShown(false)}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        width="24"
                                                    >
                                                        <path d="M0 0h24v24H0V0z" fill="none"></path>
                                                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"></path>
                                                    </svg>
                                                </div>
                                                <h4 className="calculator_openWindow_h4">
                                                    Оформление заявки
                                                </h4>

                                                <Input
                                                    className="calculator_openWindow_inpit"
                                                    placeholder="Введите ваше ФИО"
                                                    name="name"
                                                />
                                                <ErrorMessage name="name" />
                                                <InputMask mask="+7(999) 999 99-99">
                                                    {(inputProps) =>
                                                        <Input
                                                        className="calculator_openWindow_inpit"
                                                        type="tel"
                                                        placeholder="Оставьте свой телефон"
                                                        name="phone"
                                                        />}
                                                </InputMask>
                                                <ErrorMessage name="phone" />

                                                <Input
                                                    className="calculator_openWindow_inpit"
                                                    type="email"
                                                    placeholder="Напишите свой e-mail"
                                                    name="email"
                                                />
                                                <ErrorMessage name="email" />

                                                <Input
                                                    className="calculator_openWindow_inpit"
                                                    placeholder="Город доставки"
                                                    name="city"
                                                />
                                                <ErrorMessage name="city" />

                                                <h3 className="calculator_openWindow_h3">
                                                    Итого: {totalPrice} RUB
                                                </h3>
                                                <h5 className="calculator_openWindow_h5">
                                                    Стоимость доставки: {getDeliverySum()} RUB
                                                </h5>
                                                <button
                                                    className="calculator_openWindowt_button"
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? "Отправляем" : "Оставить заявку"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </React.Fragment>
                ) : (
                    <div className="columns">
                        <div className="column vs-prewiev-img">
                            <figure className="image">
                                <img
                                    src="/wp-content/themes/Lerobi-theme/img/calc-img.png"
                                    alt="ll"
                                />
                            </figure>
                        </div>
                        <div className="column right">
                            <div className="i-wrapp">
                                <div className="vs-wrapp-product-desc">
                                    <p className="why-using-parser">
                                        Как пользоваться калькулятором?
                                    </p>
                                    <p className="vs-product-decription use-calc-text">
                                        Уважаемый клиент, на нашем сайте предусмотрен калькулятор
                                        стоимости и доставки выбранных Вами товаров из магазинов
                                        <a className="lerua-res" href="https://leroymerlin.ru/">
                                            "Леруа Мерлен"
                                        </a>{" "}
                                        и{" "}
                                        <a className="obi-res" href="https://www.obi.ru/">
                                            "Оби"
                                        </a>
                                        . Для расчета стоимости выберите город доставки, введите
                                        ссылку на товар, которую скопировали из магазина "Леруа
                                        Мерлен" или "Оби", и нажмите кнопку "Рассчитать".
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </React.Fragment>
    );
}

export default App;