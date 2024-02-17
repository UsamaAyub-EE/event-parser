# event-parser

## Problem Statement

You will be given an array of JSON objects with attributes `start`, `end` and `title` which will all be strings. The `start` and `end` attributes are dates. You need to manage overlaps between events and create appropriate splits so that the final resultant array has no overlaps. 

## Constraints

- No two objects in the input array will have the same title.
- For a given object, the end date will be same or after the start date.

## Examples

For simplicity and ease in solving, the `start` and `end` variables are non-negative integers, so that you don't have to perform any date parsing.

### Example 1

```javascript
input = [
    { start: 1, end: 20, title: 'obj1' },
    { start: 5, end: 10, title: 'obj2' },
]
```

For above input, the output should be:

```javascript
[
  {
    start: 1,
    end: 4,
    title: "obj1",
    fakeEnd: true
  },
  {
    start: 5,
    end: 10,
    title: "obj2"
  },
  {
    start: 11,
    end: 20,
    title: "obj1",
    resume: true,
    fakeStart: true
  }
]
```

In the above example, an overlap exists between the two events. So, from 1 to 4, obj1 event will occur. Then from 5 to 10, obj2 event will occur and come to its end. Now, obj1 can resume from 11 and end at 20. As a bonus point, the first event in the output has `fakeEnd` set to `true` to indicate that the original event does not end here. Same is the case for `fakeStart` in the last event indicating the original event does not start here.

### Example 2

```javascript
input = [
    { start: 1, end: 20, title: 'obj1' },
    { start: 5, end: 10, title: 'obj2' },
    { start: 7, end: 12, title: 'obj3' },
    { start: 9, end: 16, title: 'obj4' }
]
```

For above input, output should be:

```javascript
[
  {
    start: 1,
    end: 4,
    title: "obj1",
    fakeEnd: true
  },
  {
    start: 5,
    end: 6,
    title: "obj2"
  },
  {
    start: 7,
    end: 8,
    title: "obj3"
  },
  {
    start: 9,
    end: 16,
    title: "obj4"
  },
  {
    start: 17,
    end: 20,
    title: "obj1",
    resume: true,
    fakeStart: true
  }
]
```


## Note

You can simply use numbers instead of dates for `start` and `end` to simplify the problem.

## Bonus

Add `fakeStart` and `fakeEnd` to the intermediate events created by splitting the original events in the array to distinguish them from the original events' start and end dates.

If you see any issues or have any feedback, feel free to contact me via [email](musama.ayub.dar@gmail.com) or [LinkedIn](https://www.linkedin.com/in/usama-ayub-01696a219/)
