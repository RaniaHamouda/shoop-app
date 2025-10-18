const MASTER_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
import { gql, GraphQLClient } from "graphql-request";
const HYGRAPH_TOKEN = process.env.HYGRAPH_TOKEN || "";
const client = new GraphQLClient(MASTER_URL, {
  headers: HYGRAPH_TOKEN ? { Authorization: `Bearer ${HYGRAPH_TOKEN}` } : {},
});

const getCategory = async () => {
  const query = gql`
    query MyQuery {
      categories(first: 100) {
        id
        name
        icon {
          url
        }
      }
    }
  `;
  const result = await client.request(query);
  return result;
};

const getRestaurants = async (category) => {
  let query;
  if (category && category !== "All") {
    query = gql`             
  query MyQuery {
    restaurantS 
    (stage: PUBLISHED, where: {category_some: {name: "${category}"}}) 
    {
      id
      name
      category {
        name
      }
      aboutUs
      adress
      banner {
        url
      }
      slug
      resTayp
      workingHours
    }
}`;
  } else {
    query = gql`
      query MyQuery {
        restaurantS {
          id
          name
          category {
            name
          }
          aboutUs
          adress
          banner {
            url
          }
          slug
          resTayp
          workingHours
        }
      }
    `;
  }

  const result = await client.request(query);
  return result;
};

const restaurantDetails = async (restaurantSlug) => {
  const query = gql`query RestaurantDetails {
  restaurant(where: {slug: "${restaurantSlug}"}) {
    adress
    banner {
      url
    }
    id
    name
    slug
    workingHours
    resTayp
    menu {
      ... on Menu {
        id
        catego
        menuitem {
          ... on Menuitem {
            id
            name
            description
            price
            productimage {
              id
              url
            }
          }
        }
      }
    }
  }
}`;
  // console.log("data is", RestaurantDetails)
  const result = await client.request(query);
  return result;
};

/** جلب assets (id, url, stage) */
export const getAssets = async () => {
  const q = gql`
    query GetAssets {
      assets {
        id
        url
        stage
      }
    }
  `;
  const res = await client.request(q);
  return res.assets || [];
};

/** إضافة عنصر للكارت باستخدام variables */
// const client = new GraphQLClient(

export const AddToCart = async (data) => {
  const mutation = gql`
    mutation AddToCart(
      $productName: String!
      $price: Float!
      $productDescription: String!
      $email: String!
      $productImg: ID!
    ) {
      # تأكيد نشر الصورة
      publishAsset(where: { id: $productImg }, to: PUBLISHED) {
        id
        stage
      }

      # إنشاء السلة
      createShoppingCart(
        data: {
          productName: $productName
          price: $price
          productDescription: $productDescription
          email: $email
          productImg: { connect: { id: $productImg } }
        }
      ) {
        id
        productName
        price
        email
        productImg {
          id
          url
          stage
        }
      }

      # نشر السلة
      publishManyShoppingCarts(to: PUBLISHED) {
        count
      }
    }
  `;

  const variables = {
    productName: data.productName || "No name",
    price: data.price,
    productDescription: data.productDescription || "No description",
    email: data.email || "guest@example.com",
    productImg: data.productImg, // ID اللي خدتيه من Query GetAssets
  };

  // console.log(" Variables sent to Hygraph:", productImg.id);

  return client.request(mutation, variables);
};

export const getUserCart = async (userEmail) => {
  const query = gql`
    query GetCart($email: String!) {
      shoppingCarts(where: { email: $email }) {
        id
        productName
        productDescription
        price
      }
    }
  `;
  const result = await client.request(query, { email: userEmail });
  return result;
};

export const DeleteFromCart = async (id) => {
  const mutation = gql`
    mutation DeleteFromCart($id: ID!) {
      deleteShoppingCart(where: { id: $id }) {
        id
      }
    }
  `;
  const result = await client.request(mutation, { id: id });
  return result;
};
export const addNewReview = async (data) => {
  const mutation = gql`
    mutation AddReview(
      $userName: String!
      $userEmail: String!
      $comments: String!
      $rating: Int!
      $slug: String!
    ) {
      createReview(
        data: {
          userEmail: $userEmail
          userName: $userName
          comments: $comments
          rating: $rating
          restaurant: { connect: { slug: $slug } }
        }
      ) {
        id
        comments
      }
      publishManyReviewS(to: PUBLISHED) {
        count
      }
    }
  `;

  const variables = {
    userName: data.userName,
    userEmail: data.userEmail,
    comments: data.comments,
    rating: Number(data.rating), // لازم يتحول Int
    slug: data.restaurantSlug,
  };

  const result = await client.request(mutation, variables);
  return result;
};

// جلب الـ Reviews
export const getReviews = async (restaurantSlug) => {
  const query = gql`
    query getReviews($slug: String!) {
      reviewS(where: { restaurant_some: { slug: $slug } }) {
        id
        userName
        userEmail
        comments
        rating
        createdAt
      }
    }
  `;

  // console.log("data is", RestaurantDetails)
  const variables = { slug: restaurantSlug };
  const result = await client.request(query, variables);
  return result;
};

export const createNewOrder = async (orderData, itemsList) => {
  const mutation = gql`
    mutation {
      createOrder(
        data: {
          userName: "${orderData.userName}"
          email: "${orderData.email}"
          orderAmount: ${parseFloat(orderData.orderAmount)}
          address: "${orderData.address}"
          zipCode: ${orderData.zipCode}
          phone: "${orderData.phone}"
          orderitems: {
            create: [
              ${itemsList
                .map(
                  (item) => `{
                    Orderdetails: {
                      name: "${item.name}",
                      price: ${parseFloat(item.price)}
                    }
                  }`
                )
                .join(",")}
            ]
          }
        }
      ) {
        id
        userName
        email
        orderAmount
        address
        zipCode
        phone
        orderitems {
          ... on Orderdetails {
            id
            name
            price
          }
        }
      }

      # ✅ بعد الإنشاء مباشرة انشر الطلب (publish)
      publishManyOrders(to: PUBLISHED) {
        count
      }

      # ✅ ونشر المنتجات اللي داخله (orderitems)
      publishManyOrderitems(to: PUBLISHED) {
        count
      }

      # ✅ ونشر التفاصيل كمان
      publishManyOrderdetails(to: PUBLISHED) {
        count
      }
    }
  `;
};

// export const createNewOrder = async (orderData, itemsList) => {
//   // ✅ 1. أولًا: إنشاء الطلب
//   const createMutation = gql`
//     mutation CreateOrder($data: OrderCreateInput!) {
//       createOrder(data: $data) {
//         id
//       }
//     }
//   `;

//   const variables = {
//     data: {
//       userName: orderData.userName,
//       email: orderData.email,
//       orderAmount: parseFloat(orderData.orderAmount),
//       address: orderData.address,
//       zipCode: orderData.zipCode,
//       phone: orderData.phone,
//       orderitems: {
//         create: itemsList.map((item) => ({
//           Orderdetails: {
//             create: {
//               name: item.name,
//               price: parseFloat(item.price),
//             },
//           },
//         })),
//       },
//     },
//   };

//   try {
//     const result = await client.request(createMutation, variables);
//     const orderId = result?.createOrder?.id;

//     console.log("✅ Order created with ID:", orderId);

//     // ✅ 2. بعد الإنشاء — نشر البيانات
//     const publishMutation = gql`
//       mutation PublishEverything($id: ID!) {
//         publishOrder(where: { id: $id }, to: PUBLISHED) {
//           id
//         }
//         publishManyOrderitems(to: PUBLISHED) {
//           count
//         }
//         publishManyOrderdetails(to: PUBLISHED) {
//           count
//         }
//       }
//     `;

//     await client.request(publishMutation, { id: orderId });

//     console.log("🚀 Order and related items published successfully!");

//     return orderId;
//   } catch (error) {
//     console.error("❌ Error creating or publishing order:", error);
//     throw error;
//   }
// };

export const myOrders = async (email) => {
  const query = gql`
    query MyOrders($email: String!) {
      orders(where: { email: $email }) {
        id
        userName
        orderAmount
        email
        address
        createdAt
        phone
        zipCode
        orderitems {
          ... on Orderdetails {
            id
            name
            price
          }
        }
      }
    }
  `;

  try {
    const result = await client.request(query, { email });
    // console.log("✅ Orders from Hygraph:", result);
    return result;
  } catch (error) {
    // console.error("❌ Error fetching orders:", error);
    throw error;
  }
};

export default {
  getCategory,
  getRestaurants,
  restaurantDetails,
  AddToCart,
  getAssets,
  getUserCart,
  DeleteFromCart,
  addNewReview,
  getReviews,
  createNewOrder,
  myOrders,
};
