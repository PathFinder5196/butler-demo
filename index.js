const exampleRequests = [
  {
    clientId: 1,
    requestId: "abc",
    hours: 3,
  },
  {
    clientId: 2,
    requestId: "ghi",
    hours: 1,
  },
  {
    clientId: 1,
    requestId: "edf",
    hours: 3,
  },
  {
    clientId: 1,
    requestId: "zzz",
    hours: 3,
  },
  {
    clientId: 1,
    requestId: "def",
    hours: 1,
  },
  {
    clientId: 4,
    requestId: "jkl",
    hours: 2,
  },
  {
    clientId: 3,
    requestId: "mno",
    hours: 3,
  },
  {
    clientId: 2,
    requestId: "pqr",
    hours: 3,
  },
  {
    clientId: 1,
    requestId: "stu",
    hours: 4,
  },
  {
    clientId: 5,
    requestId: "vwx",
    hours: 4,
  },
  {
    clientId: 6,
    requestId: "xyz",
    hours: 5,
  },
  {
    clientId: 6,
    requestId: "zdi",
    hours: 8,
  },
];

const maxHourLimit = 8;
const spreadClientIds = new Set();

/**
 *
 * This method will process client request and assign the request to butler
 * @param {input for existing butlers} butlers
 * @param {this represents client request} request
 *
 */
function assignButlers(butlers, request, totalHours) {
  const { requestId, clientId, hours } = request;
  let selectedButler = null;
  for (let index = 0; index < butlers.length; index++) {
    const butler = butlers[index];
    if (
      butler.hours + hours <= maxHourLimit &&
      (butler.clientIds.indexOf(clientId) > -1 ||
        (butler.clientIds.indexOf(clientId) === -1 &&
          totalHours + butler.hours <= maxHourLimit))
    ) {
      selectedButler = butler;
      break;
    }
  }
  if (selectedButler !== null) {
    selectedButler.hours += hours;
    selectedButler.requests.push(requestId);
    selectedButler.clientIds.push(clientId);
  } else {
    butlers.push({ requests: [requestId], hours, clientIds: [clientId] });
  }
}

/**
 *
 * This method will group the iput array based on key passed
 * @param {Input array of requests} elements
 * @param {This is key by which array of requests will be grouped by} key
 */
function groupBy(requests, keyGetter) {
  const map = new Map();
  requests.forEach((request) => {
    const key = keyGetter(request);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [request]);
    } else {
      collection.push(request);
    }
  });
  return map;
}

/**
 *
 * This method is responsible for running butlers allocation logic
 * @param {It takes individual client requests as input} clientRequests
 */
function allocateButlers(butlers, requests, totalHours) {
  const sortedRequests = requests.sort((a, b) =>
    a.hours < b.hours ? 1 : b.hours < a.hours ? -1 : 0
  );
  sortedRequests.forEach((request) => {
    const { requestId, hours } = request;
    spreadClientIds.add(request.clientId);

    if (butlers.length > 0) {
      assignButlers(butlers, request, totalHours);
    } else {
      butlers.push({
        requests: [requestId],
        hours,
        clientIds: [request.clientId],
      });
    }
  });
}

/**
 * THis method is entry point for program
 * @param {It takes client requests array as input} requests
 */
function allocateAndReport(requests) {
  const butlers = [];

  const grouped = groupBy(requests, (request) => request.clientId);
  for (let [key, value] of grouped) {
    const totalHours = value.reduce((sum, req) => {
      return sum + req.hours;
    }, 0);
    allocateButlers(butlers, value, totalHours);
  }

  const buttlerRequests = butlers.map((butler) => {
    for (const [key, value] of Object.entries(butler)) {
      return value;
    }
  });

  const result = {
    butlers: buttlerRequests,
    spreadClientIds: [...spreadClientIds],
  };

  console.log(result);
}
/**
 * Call main function to start processing
 */
allocateAndReport(exampleRequests);
