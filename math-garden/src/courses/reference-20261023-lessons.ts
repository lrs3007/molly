import type { Lesson } from '../content.ts';
// 原题逐字来自 reference-20261023.ts；第一道图形大题拆为三节独立课程。
export const reference20261023Lessons: Lesson[] = [
  {
    "id": "transferpeachesref-1",
    "version": 1,
    "grade": 1,
    "topic": "transfer",
    "title": "原题1·移后相等倒推原数",
    "description": "14减3＝8加3＝11。",
    "problem": "有两盘桃，从第一盘里拿3个放入第二盘后，两盘桃就同样多。已知第二盘原来有8个桃，第一盘原来有多少个桃？",
    "level": "原题挑战",
    "pathOrder": 101.0,
    "tags": [
      "原题挑战",
      "2026年10月原题汇编",
      "第1题"
    ],
    "scene": {
      "kind": "storyboard",
      "frames": [
        {
          "kind": "transfer-story",
          "names": [
            "第一盘",
            "第二盘"
          ],
          "values": [
            11,
            11
          ],
          "unit": "个",
          "illustrative": false,
          "action": "",
          "title": "先看移后的第二盘",
          "footer": "第二盘原有8个，收到3个后是11个。"
        },
        {
          "kind": "transfer-story",
          "names": [
            "第一盘",
            "第二盘"
          ],
          "values": [
            11,
            11
          ],
          "unit": "个",
          "illustrative": false,
          "action": "",
          "title": "两盘移后都一样多",
          "footer": "第一盘移后也有11个。"
        },
        {
          "kind": "transfer-story",
          "names": [
            "第一盘",
            "第二盘"
          ],
          "values": [
            11,
            11
          ],
          "unit": "个",
          "illustrative": false,
          "action": "",
          "title": "先想一想",
          "footer": "还原给出者，应该把3个加回来。"
        },
        {
          "kind": "transfer-story",
          "names": [
            "第一盘",
            "第二盘"
          ],
          "values": [
            14,
            8
          ],
          "unit": "个",
          "illustrative": false,
          "action": "",
          "title": "把给出的加回来",
          "footer": "第一盘原来14个。"
        },
        {
          "kind": "transfer-story",
          "names": [
            "第一盘",
            "第二盘"
          ],
          "values": [
            11,
            11
          ],
          "unit": "个",
          "illustrative": false,
          "action": "",
          "title": "正着移一次检查",
          "footer": "14减3＝8加3＝11。"
        }
      ]
    },
    "steps": [
      {
        "title": "先看移后的第二盘",
        "caption": "第二盘原有8个，收到3个后是11个。",
        "narration": "第一盘给第二盘3个桃，两盘就一样多。先看第二盘，原来8个，再收到3个，移后是11个。",
        "formula": "8＋3＝11（个）"
      },
      {
        "title": "两盘移后都一样多",
        "caption": "第一盘移后也有11个。",
        "narration": "两盘相等，第二盘移后11个，第一盘移后当然也是11个。先找到移后的数量，再倒着还原。"
      },
      {
        "title": "先想一想",
        "caption": "还原给出者，应该把3个加回来。",
        "narration": "第一盘是给出桃的一方。要从移后的11个还原到原来，应该加回3个，还是再减去3个？",
        "question": {
          "prompt": "第一盘原数怎样还原？",
          "choices": [
            "11－3",
            "11＋3",
            "8－3"
          ],
          "answer": 1,
          "explanation": "第一盘给出3个，还原时加回3个。"
        }
      },
      {
        "title": "把给出的加回来",
        "caption": "第一盘原来14个。",
        "narration": "看动画倒着走，把给出的3个拿回第一盘。11加3等于14，所以第一盘原来有14个桃。",
        "formula": "11＋3＝14（个）"
      },
      {
        "title": "正着移一次检查",
        "caption": "14减3＝8加3＝11。",
        "narration": "检查一下，第一盘14减3是11，第二盘8加3也是11。先求收到者移后有多少，再给给出者加回去。",
        "formula": "14－3＝8＋3＝11"
      }
    ],
    "exercises": [
      {
        "id": "transferpeachesref-1-a",
        "level": "举一反三",
        "prompt": "两盘糖果，第一盘给第二盘4颗后相等。第二盘原有10颗，第一盘原有多少颗？",
        "answer": "18",
        "unit": "颗",
        "hint": "14减3＝8加3＝11。",
        "explanation": "第二盘移后10＋4＝14颗；第一盘原有14＋4＝18颗。"
      }
    ],
    "takeaway": "14减3＝8加3＝11。",
    "mistakes": [
      "一件物品在两人之间移动，会让一方减少、另一方增加，数量差改变两件。",
      "倒推或改换移动方向时，先还原原来的状态；共同向外送出时不要当成互相转移。"
    ],
    "source": {
      "document": "数学原题分类汇编.docx",
      "question": "第1题",
      "paragraph": 5,
      "kind": "original"
    }
  },
  {
    "id": "transferfishref-1",
    "version": 1,
    "grade": 1,
    "topic": "transfer",
    "title": "原题2·移后仍有差",
    "description": "24减去2个10，还差4。",
    "problem": "农场有两个池塘，甲池塘里的鱼比乙池塘里的鱼多24条，从甲池塘里捉多少条鱼到乙池塘里之后，甲池塘里的鱼还比乙池塘多4条？",
    "level": "原题挑战",
    "pathOrder": 102.0,
    "tags": [
      "原题挑战",
      "2026年10月原题汇编",
      "第2题"
    ],
    "scene": {
      "kind": "storyboard",
      "frames": [
        {
          "kind": "transfer-story",
          "names": [
            "甲池",
            "乙池"
          ],
          "values": [
            34,
            10
          ],
          "unit": "条",
          "illustrative": true,
          "action": "",
          "title": "只比较两池的差",
          "footer": "原差24条，目标还差4条。"
        },
        {
          "kind": "transfer-story",
          "names": [
            "甲池",
            "乙池"
          ],
          "values": [
            33,
            11
          ],
          "unit": "条",
          "illustrative": true,
          "action": "",
          "title": "搬1条改变两边",
          "footer": "甲少1条，乙多1条，差缩小2条。"
        },
        {
          "kind": "transfer-story",
          "names": [
            "甲池",
            "乙池"
          ],
          "values": [
            34,
            10
          ],
          "unit": "条",
          "illustrative": true,
          "action": "",
          "title": "先想一想",
          "footer": "需要缩小的差是24减4。"
        },
        {
          "kind": "transfer-story",
          "names": [
            "甲池",
            "乙池"
          ],
          "values": [
            24,
            20
          ],
          "unit": "条",
          "illustrative": true,
          "action": "",
          "title": "把缩小的差除以2",
          "footer": "一共移动10条鱼。"
        },
        {
          "kind": "transfer-story",
          "names": [
            "甲池",
            "乙池"
          ],
          "values": [
            24,
            20
          ],
          "unit": "条",
          "illustrative": true,
          "action": "",
          "title": "代回差来检查",
          "footer": "24减去2个10，还差4。"
        }
      ]
    },
    "steps": [
      {
        "title": "只比较两池的差",
        "caption": "原差24条，目标还差4条。",
        "narration": "甲池比乙池多24条，移动以后还要多4条。这次不需要完全相等，只需让差从24缩小到4。"
      },
      {
        "title": "搬1条改变两边",
        "caption": "甲少1条，乙多1条，差缩小2条。",
        "narration": "每捉1条到乙池，甲池少1条，乙池多1条。两边一起变，差一次缩小2条。"
      },
      {
        "title": "先想一想",
        "caption": "需要缩小的差是24减4。",
        "narration": "原来差24条，最后还差4条。想一想，要缩小多少条？不是把24全部消掉哦。",
        "question": {
          "prompt": "差需要缩小多少条？",
          "choices": [
            "24条",
            "20条",
            "4条"
          ],
          "answer": 1,
          "explanation": "24－4＝20条。"
        }
      },
      {
        "title": "把缩小的差除以2",
        "caption": "一共移动10条鱼。",
        "narration": "需要缩小24减4，等于20条的差。每移动1条差缩小2条，所以20除以2，移动10条。",
        "formula": "（24－4）÷2＝10（条）"
      },
      {
        "title": "代回差来检查",
        "caption": "24减去2个10，还差4。",
        "narration": "动画用一组示例数量演示。移动10条以后，差确实从24变成4。知道前后的差，先求差的变化，再除以2。",
        "formula": "24－2×10＝4"
      }
    ],
    "exercises": [
      {
        "id": "transferfishref-1-a",
        "level": "举一反三",
        "prompt": "甲比乙多30条鱼，甲给乙多少条后，甲还比乙多6条？",
        "answer": "12",
        "unit": "条",
        "hint": "24减去2个10，还差4。",
        "explanation": "（30－6）÷2＝12条。"
      }
    ],
    "takeaway": "24减去2个10，还差4。",
    "mistakes": [
      "一件物品在两人之间移动，会让一方减少、另一方增加，数量差改变两件。",
      "倒推或改换移动方向时，先还原原来的状态；共同向外送出时不要当成互相转移。"
    ],
    "source": {
      "document": "数学原题分类汇编.docx",
      "question": "第2题",
      "paragraph": 7,
      "kind": "original"
    }
  },
  {
    "id": "transfercakesref-1",
    "version": 1,
    "grade": 1,
    "topic": "transfer",
    "title": "原题3·往返移送看净移动",
    "description": "差先增加24，再缩小4，剩20。",
    "problem": "阿宝与大刘有同样多的蛋糕，如果阿宝给大刘12个，大刘再还给阿宝2个，那么此时大刘比阿宝多多少个蛋糕？",
    "level": "原题挑战",
    "pathOrder": 103.0,
    "tags": [
      "原题挑战",
      "2026年10月原题汇编",
      "第3题"
    ],
    "scene": {
      "kind": "storyboard",
      "frames": [
        {
          "kind": "transfer-story",
          "names": [
            "阿宝",
            "大刘"
          ],
          "values": [
            20,
            20
          ],
          "unit": "个",
          "illustrative": true,
          "action": "",
          "title": "原来同样多",
          "footer": "阿宝和大刘原来的差是0。"
        },
        {
          "kind": "transfer-story",
          "names": [
            "阿宝",
            "大刘"
          ],
          "values": [
            8,
            32
          ],
          "unit": "个",
          "illustrative": true,
          "action": "",
          "title": "先看第一次送出",
          "footer": "阿宝少12个，大刘多12个。"
        },
        {
          "kind": "transfer-story",
          "names": [
            "阿宝",
            "大刘"
          ],
          "values": [
            8,
            32
          ],
          "unit": "个",
          "illustrative": true,
          "action": "",
          "title": "先想一想",
          "footer": "送12个再还2个，净送出10个。"
        },
        {
          "kind": "transfer-story",
          "names": [
            "阿宝",
            "大刘"
          ],
          "values": [
            10,
            30
          ],
          "unit": "个",
          "illustrative": true,
          "action": "",
          "title": "用净移动量求差",
          "footer": "大刘最终比阿宝多20个。"
        },
        {
          "kind": "transfer-story",
          "names": [
            "阿宝",
            "大刘"
          ],
          "values": [
            10,
            30
          ],
          "unit": "个",
          "illustrative": true,
          "action": "",
          "title": "分两步也能检查",
          "footer": "差先增加24，再缩小4，剩20。"
        }
      ]
    },
    "steps": [
      {
        "title": "原来同样多",
        "caption": "阿宝和大刘原来的差是0。",
        "narration": "原来两人的蛋糕一样多。阿宝先给出12个，大刘又还回2个，注意有两个方向的移动。"
      },
      {
        "title": "先看第一次送出",
        "caption": "阿宝少12个，大刘多12个。",
        "narration": "先送12个，给出者少12，收到者多12，两人的差变成24个。"
      },
      {
        "title": "先想一想",
        "caption": "送12个再还2个，净送出10个。",
        "narration": "阿宝送出12个，又收到2个。只看最终效果，相当于阿宝一共送出多少个呢？",
        "question": {
          "prompt": "净送出多少个？",
          "choices": [
            "14个",
            "10个",
            "2个"
          ],
          "answer": 1,
          "explanation": "送出12个，收回2个，净送出10个。"
        }
      },
      {
        "title": "用净移动量求差",
        "caption": "大刘最终比阿宝多20个。",
        "narration": "12减2等于10，相当于阿宝净送出10个。双方同时变化，大刘比阿宝多2个10，就是20个。",
        "formula": "（12－2）×2＝20（个）"
      },
      {
        "title": "分两步也能检查",
        "caption": "差先增加24，再缩小4，剩20。",
        "narration": "也可以分开检查，第一次差增加24，返还2个让差缩小4。24减4还是20。往返移动，先找净移动量。",
        "formula": "12×2－2×2＝20"
      }
    ],
    "exercises": [
      {
        "id": "transfercakesref-1-a",
        "level": "举一反三",
        "prompt": "两人原来一样多，甲给乙9个饼，乙再还3个。乙最终比甲多多少个？",
        "answer": "12",
        "unit": "个",
        "hint": "差先增加24，再缩小4，剩20。",
        "explanation": "（9－3）×2＝12个。"
      }
    ],
    "takeaway": "差先增加24，再缩小4，剩20。",
    "mistakes": [
      "一件物品在两人之间移动，会让一方减少、另一方增加，数量差改变两件。",
      "倒推或改换移动方向时，先还原原来的状态；共同向外送出时不要当成互相转移。"
    ],
    "source": {
      "document": "数学原题分类汇编.docx",
      "question": "第3题",
      "paragraph": 9,
      "kind": "original"
    }
  },
  {
    "id": "transferpigeonsref-1",
    "version": 1,
    "grade": 1,
    "topic": "transfer",
    "title": "原题4·从多21到少3",
    "description": "21减24＝负3，表示甲少3只。",
    "problem": "学校有甲、乙两个鸽棚，甲鸽棚里的鸽子比乙鸽棚多21只，从甲鸽棚里捉多少只鸽子放入乙鸽棚后，甲鸽棚就比乙鸽棚少3只鸽子？",
    "level": "原题挑战",
    "pathOrder": 104.0,
    "tags": [
      "原题挑战",
      "2026年10月原题汇编",
      "第4题"
    ],
    "scene": {
      "kind": "storyboard",
      "frames": [
        {
          "kind": "transfer-story",
          "names": [
            "甲鸽棚",
            "乙鸽棚"
          ],
          "values": [
            31,
            10
          ],
          "unit": "只",
          "illustrative": true,
          "action": "",
          "title": "注意多少逆转",
          "footer": "甲原来多21只，后来反而少3只。"
        },
        {
          "kind": "transfer-story",
          "names": [
            "甲鸽棚",
            "乙鸽棚"
          ],
          "values": [
            31,
            10
          ],
          "unit": "只",
          "illustrative": true,
          "action": "",
          "title": "先追平再继续",
          "footer": "先消掉21的优势，再形成3的劣势。"
        },
        {
          "kind": "transfer-story",
          "names": [
            "甲鸽棚",
            "乙鸽棚"
          ],
          "values": [
            31,
            10
          ],
          "unit": "只",
          "illustrative": true,
          "action": "",
          "title": "先想一想",
          "footer": "从多到少，变化量要相加。"
        },
        {
          "kind": "transfer-story",
          "names": [
            "甲鸽棚",
            "乙鸽棚"
          ],
          "values": [
            19,
            22
          ],
          "unit": "只",
          "illustrative": true,
          "action": "",
          "title": "每移1只差改变2",
          "footer": "需要从甲移12只到乙。"
        },
        {
          "kind": "transfer-story",
          "names": [
            "甲鸽棚",
            "乙鸽棚"
          ],
          "values": [
            19,
            22
          ],
          "unit": "只",
          "illustrative": true,
          "action": "",
          "title": "检查负号的意义",
          "footer": "21减24＝负3，表示甲少3只。"
        }
      ]
    },
    "steps": [
      {
        "title": "注意多少逆转",
        "caption": "甲原来多21只，后来反而少3只。",
        "narration": "甲原来比乙多21只。移后甲比乙少3只，已经越过相等的时刻，差要按方向比较。"
      },
      {
        "title": "先追平再继续",
        "caption": "先消掉21的优势，再形成3的劣势。",
        "narration": "先让甲多出的21消失，再继续移动，直到甲少3。差一共改变21加3，也就是24只。",
        "formula": "21＋3＝24"
      },
      {
        "title": "先想一想",
        "caption": "从多到少，变化量要相加。",
        "narration": "多21变成少3，差的变化是21减3，还是21加3？可以把相等看成中间的零点。",
        "question": {
          "prompt": "差一共改变多少只？",
          "choices": [
            "18只",
            "24只",
            "3只"
          ],
          "answer": 1,
          "explanation": "多21到少3，变化21＋3＝24只。"
        }
      },
      {
        "title": "每移1只差改变2",
        "caption": "需要从甲移12只到乙。",
        "narration": "每移1只，甲少1只、乙多1只，差改变2只。24除以2等于12，需要移12只。",
        "formula": "（21＋3）÷2＝12（只）"
      },
      {
        "title": "检查负号的意义",
        "caption": "21减24＝负3，表示甲少3只。",
        "narration": "用示例数量看，甲31只乙10只，移12只后变19和22，甲确实少3只。发生多少逆转时，前后的差要相加。",
        "formula": "21－2×12＝－3"
      }
    ],
    "exercises": [
      {
        "id": "transferpigeonsref-1-a",
        "level": "举一反三",
        "prompt": "甲比乙多18只鸟，甲给乙多少只后反而比乙少4只？",
        "answer": "11",
        "unit": "只",
        "hint": "21减24＝负3，表示甲少3只。",
        "explanation": "（18＋4）÷2＝11只。"
      }
    ],
    "takeaway": "21减24＝负3，表示甲少3只。",
    "mistakes": [
      "一件物品在两人之间移动，会让一方减少、另一方增加，数量差改变两件。",
      "倒推或改换移动方向时，先还原原来的状态；共同向外送出时不要当成互相转移。"
    ],
    "source": {
      "document": "数学原题分类汇编.docx",
      "question": "第4题",
      "paragraph": 11,
      "kind": "original"
    }
  },
  {
    "id": "transferspoonsref-1",
    "version": 1,
    "grade": 1,
    "topic": "transfer",
    "title": "原题5·已知移动求剩余差",
    "description": "示例22个与18个，正好差4。",
    "problem": "猫尼卡比阿宝多20个勺子，猫尼卡给阿宝8个勺子后，还比阿宝多多少个勺子？",
    "level": "原题挑战",
    "pathOrder": 105.0,
    "tags": [
      "原题挑战",
      "2026年10月原题汇编",
      "第5题"
    ],
    "scene": {
      "kind": "storyboard",
      "frames": [
        {
          "kind": "transfer-story",
          "names": [
            "猫尼卡",
            "阿宝"
          ],
          "values": [
            30,
            10
          ],
          "unit": "个",
          "illustrative": true,
          "action": "",
          "title": "原来相差20个",
          "footer": "猫尼卡给阿宝8个勺子。"
        },
        {
          "kind": "transfer-story",
          "names": [
            "猫尼卡",
            "阿宝"
          ],
          "values": [
            29,
            11
          ],
          "unit": "个",
          "illustrative": true,
          "action": "",
          "title": "两边各变化8",
          "footer": "猫尼卡少8，阿宝多8。"
        },
        {
          "kind": "transfer-story",
          "names": [
            "猫尼卡",
            "阿宝"
          ],
          "values": [
            30,
            10
          ],
          "unit": "个",
          "illustrative": true,
          "action": "",
          "title": "先想一想",
          "footer": "数量差不是只缩小8。"
        },
        {
          "kind": "transfer-story",
          "names": [
            "猫尼卡",
            "阿宝"
          ],
          "values": [
            22,
            18
          ],
          "unit": "个",
          "illustrative": true,
          "action": "",
          "title": "从原差扣除变化",
          "footer": "移后还多4个。"
        },
        {
          "kind": "transfer-story",
          "names": [
            "猫尼卡",
            "阿宝"
          ],
          "values": [
            22,
            18
          ],
          "unit": "个",
          "illustrative": true,
          "action": "",
          "title": "比较移后数量",
          "footer": "示例22个与18个，正好差4。"
        }
      ]
    },
    "steps": [
      {
        "title": "原来相差20个",
        "caption": "猫尼卡给阿宝8个勺子。",
        "narration": "猫尼卡原来多20个勺子，给阿宝8个。题目问给过以后还多几个，不是问要给几个。"
      },
      {
        "title": "两边各变化8",
        "caption": "猫尼卡少8，阿宝多8。",
        "narration": "给的一方减少8，收到的一方增加8，所以原来的差一共缩小16。两边的变化都不能漏掉。",
        "formula": "8×2＝16"
      },
      {
        "title": "先想一想",
        "caption": "数量差不是只缩小8。",
        "narration": "移动8个以后，差会缩小8还是16？要同时看两个人的数量怎样变化。",
        "question": {
          "prompt": "差会缩小多少个？",
          "choices": [
            "8个",
            "16个",
            "20个"
          ],
          "answer": 1,
          "explanation": "两边同时改变8，差缩小16。"
        }
      },
      {
        "title": "从原差扣除变化",
        "caption": "移后还多4个。",
        "narration": "原差20，扣掉缩小的16，剩下4。猫尼卡给阿宝以后，还比阿宝多4个勺子。",
        "formula": "20－8×2＝4（个）"
      },
      {
        "title": "比较移后数量",
        "caption": "示例22个与18个，正好差4。",
        "narration": "动画用30个和10个演示，移8个后是22和18，相差4。已知移动量求新差，要扣掉移动量的两倍。",
        "formula": "22－18＝4"
      }
    ],
    "exercises": [
      {
        "id": "transferspoonsref-1-a",
        "level": "举一反三",
        "prompt": "甲比乙多18支笔，甲给乙5支后还比乙多几支？",
        "answer": "8",
        "unit": "支",
        "hint": "示例22个与18个，正好差4。",
        "explanation": "18－5×2＝8支。"
      }
    ],
    "takeaway": "示例22个与18个，正好差4。",
    "mistakes": [
      "一件物品在两人之间移动，会让一方减少、另一方增加，数量差改变两件。",
      "倒推或改换移动方向时，先还原原来的状态；共同向外送出时不要当成互相转移。"
    ],
    "source": {
      "document": "数学原题分类汇编.docx",
      "question": "第5题",
      "paragraph": 13,
      "kind": "original"
    }
  },
  {
    "id": "transfercandypriceref-1",
    "version": 1,
    "grade": 1,
    "topic": "transfer",
    "title": "原题6·等额出钱与补款",
    "description": "各出20元，大牛补4元后承担24元。",
    "problem": "大牛和小牛带着同样多的钱去买怪味糖，他们把全部的钱都花光了。买完后，大牛拿走了12包，小牛拿走了8包。回家后，大牛补给了小牛4元，那么一包怪味糖是多少钱呢？",
    "level": "原题挑战",
    "pathOrder": 106.0,
    "tags": [
      "原题挑战",
      "2026年10月原题汇编",
      "第6题"
    ],
    "scene": {
      "kind": "storyboard",
      "frames": [
        {
          "kind": "bars",
          "rows": [
            {
              "label": "应得：大牛",
              "value": 10
            },
            {
              "label": "应得：小牛",
              "value": 10
            }
          ],
          "title": "先算公平份额",
          "footer": "一共20包，等额出钱应各得10包。"
        },
        {
          "kind": "bars",
          "rows": [
            {
              "label": "实得：大牛",
              "value": 12
            },
            {
              "label": "实得：小牛",
              "value": 8
            }
          ],
          "title": "找到多拿的部分",
          "footer": "大牛多拿2包，小牛少拿2包。"
        },
        {
          "kind": "bars",
          "rows": [
            {
              "label": "多拿部分（包）",
              "value": 2
            },
            {
              "label": "应得份额（包）",
              "value": 10
            }
          ],
          "title": "先想一想",
          "footer": "4元对应多拿的2包。"
        },
        {
          "kind": "bars",
          "rows": [
            {
              "label": "多拿2包的价钱",
              "value": 4
            },
            {
              "label": "每包价格",
              "value": 2
            }
          ],
          "title": "求一包的价格",
          "footer": "每包怪味糖2元。"
        },
        {
          "kind": "bars",
          "rows": [
            {
              "label": "大牛实际承担",
              "value": 24
            },
            {
              "label": "小牛实际承担",
              "value": 16
            }
          ],
          "title": "检查各自承担的钱",
          "footer": "各出20元，大牛补4元后承担24元。"
        }
      ]
    },
    "steps": [
      {
        "title": "先算公平份额",
        "caption": "一共20包，等额出钱应各得10包。",
        "narration": "两人出同样多的钱，一共买12加8，等于20包。公平分配，每人应得10包。",
        "formula": "（12＋8）÷2＝10（包）"
      },
      {
        "title": "找到多拿的部分",
        "caption": "大牛多拿2包，小牛少拿2包。",
        "narration": "大牛拿12包，比应得10包多2包；小牛拿8包，少了2包。需要补偿的是这2包的价钱。",
        "formula": "12－10＝2（包）"
      },
      {
        "title": "先想一想",
        "caption": "4元对应多拿的2包。",
        "narration": "大牛比小牛多4包，但多拿的份额只有2包。补给小牛的4元，对应2包还是4包呢？",
        "question": {
          "prompt": "补的4元对应多少包？",
          "choices": [
            "4包",
            "2包",
            "20包"
          ],
          "answer": 1,
          "explanation": "大牛应得10包，实际12包，多拿2包。"
        }
      },
      {
        "title": "求一包的价格",
        "caption": "每包怪味糖2元。",
        "narration": "把4元补款分给多拿的两包，4除以2等于2。每包怪味糖2元。补的是多拿的份额。",
        "formula": "4÷2＝2（元/包）"
      },
      {
        "title": "检查各自承担的钱",
        "caption": "各出20元，大牛补4元后承担24元。",
        "narration": "每包2元，总价40元，两人各出20元。大牛拿12包值24元，再补4元正好；小牛拿8包值16元，收回4元也正好。",
        "formula": "12×2－20＝4（元）"
      }
    ],
    "exercises": [
      {
        "id": "transfercandypriceref-1-a",
        "level": "举一反三",
        "prompt": "两人等额出钱买糖，甲拿14包，乙拿10包，甲补乙6元。每包多少元？",
        "answer": "3",
        "unit": "元",
        "hint": "各出20元，大牛补4元后承担24元。",
        "explanation": "每人应得12包，甲多拿2包，6÷2＝3元。"
      }
    ],
    "takeaway": "各出20元，大牛补4元后承担24元。",
    "mistakes": [
      "一件物品在两人之间移动，会让一方减少、另一方增加，数量差改变两件。",
      "倒推或改换移动方向时，先还原原来的状态；共同向外送出时不要当成互相转移。"
    ],
    "source": {
      "document": "数学原题分类汇编.docx",
      "question": "第6题",
      "paragraph": 15,
      "kind": "original"
    }
  },
  {
    "id": "transferorangesref-1",
    "version": 1,
    "grade": 1,
    "topic": "transfer",
    "title": "原题7·从移后差还原原差",
    "description": "20减16＝4。",
    "problem": "璐璐给姗姗8个桔子后，璐璐还比姗姗多4个桔子，那么原来璐璐比姗姗多几个桔子？",
    "level": "原题挑战",
    "pathOrder": 107.0,
    "tags": [
      "原题挑战",
      "2026年10月原题汇编",
      "第7题"
    ],
    "scene": {
      "kind": "storyboard",
      "frames": [
        {
          "kind": "transfer-story",
          "names": [
            "璐璐",
            "姗姗"
          ],
          "values": [
            12,
            8
          ],
          "unit": "个",
          "illustrative": true,
          "action": "",
          "title": "记录移后的差",
          "footer": "璐璐送8个后仍多4个。"
        },
        {
          "kind": "transfer-story",
          "names": [
            "璐璐",
            "姗姗"
          ],
          "values": [
            12,
            8
          ],
          "unit": "个",
          "illustrative": true,
          "action": "",
          "title": "移动让差缩小16",
          "footer": "给8个，两边各变8。"
        },
        {
          "kind": "transfer-story",
          "names": [
            "璐璐",
            "姗姗"
          ],
          "values": [
            12,
            8
          ],
          "unit": "个",
          "illustrative": true,
          "action": "",
          "title": "先想一想",
          "footer": "倒推原差要把缩小的部分加回去。"
        },
        {
          "kind": "transfer-story",
          "names": [
            "璐璐",
            "姗姗"
          ],
          "values": [
            20,
            0
          ],
          "unit": "个",
          "illustrative": true,
          "action": "",
          "title": "还原原来数量差",
          "footer": "原来璐璐多20个。"
        },
        {
          "kind": "transfer-story",
          "names": [
            "璐璐",
            "姗姗"
          ],
          "values": [
            12,
            8
          ],
          "unit": "个",
          "illustrative": true,
          "action": "",
          "title": "正向复核",
          "footer": "20减16＝4。"
        }
      ]
    },
    "steps": [
      {
        "title": "记录移后的差",
        "caption": "璐璐送8个后仍多4个。",
        "narration": "璐璐给姗姗8个桔子以后，还多4个。现在知道的是移动后的差，要倒推原来的差。"
      },
      {
        "title": "移动让差缩小16",
        "caption": "给8个，两边各变8。",
        "narration": "每移动1个，差缩小2；移动8个，差缩小16。原来的差应该比现在大16。",
        "formula": "8×2＝16"
      },
      {
        "title": "先想一想",
        "caption": "倒推原差要把缩小的部分加回去。",
        "narration": "已知现在还差4个，要还原原差，是加回16，还是减去16？跟着动画倒着想。",
        "question": {
          "prompt": "原差怎样计算？",
          "choices": [
            "4＋8",
            "4＋16",
            "16－4"
          ],
          "answer": 1,
          "explanation": "还原差，需要加回移动8个使差缩小的16。"
        }
      },
      {
        "title": "还原原来数量差",
        "caption": "原来璐璐多20个。",
        "narration": "把已经缩小的16加回去，4加16等于20。原来璐璐比姗姗多20个桔子。",
        "formula": "4＋8×2＝20（个）"
      },
      {
        "title": "正向复核",
        "caption": "20减16＝4。",
        "narration": "检查原差20，移动8个后缩小16，正好还多4。倒推原差，先看给了多少，再加回两倍移动量。",
        "formula": "20－8×2＝4"
      }
    ],
    "exercises": [
      {
        "id": "transferorangesref-1-a",
        "level": "举一反三",
        "prompt": "甲给乙6个橘子后还比乙多5个，原来甲比乙多几个？",
        "answer": "17",
        "unit": "个",
        "hint": "20减16＝4。",
        "explanation": "5＋6×2＝17个。"
      }
    ],
    "takeaway": "20减16＝4。",
    "mistakes": [
      "一件物品在两人之间移动，会让一方减少、另一方增加，数量差改变两件。",
      "倒推或改换移动方向时，先还原原来的状态；共同向外送出时不要当成互相转移。"
    ],
    "source": {
      "document": "数学原题分类汇编.docx",
      "question": "第7题",
      "paragraph": 19,
      "kind": "original"
    }
  },
  {
    "id": "transfertartsref-1",
    "version": 1,
    "grade": 1,
    "topic": "transfer",
    "title": "原题8·移后逆转倒推原差",
    "description": "原来差18，移后差负2。",
    "problem": "胖虎给团团10个蛋挞后，团团比胖虎多2个蛋挞，原来胖虎比团团多多少个蛋挞？",
    "level": "原题挑战",
    "pathOrder": 108.0,
    "tags": [
      "原题挑战",
      "2026年10月原题汇编",
      "第8题"
    ],
    "scene": {
      "kind": "storyboard",
      "frames": [
        {
          "kind": "transfer-story",
          "names": [
            "胖虎",
            "团团"
          ],
          "values": [
            10,
            12
          ],
          "unit": "个",
          "illustrative": true,
          "action": "",
          "title": "确定现在谁更多",
          "footer": "胖虎给10个后，团团多2个。"
        },
        {
          "kind": "transfer-story",
          "names": [
            "胖虎",
            "团团"
          ],
          "values": [
            10,
            12
          ],
          "unit": "个",
          "illustrative": true,
          "action": "",
          "title": "现在的差是负2",
          "footer": "给10个让有向差减少20。"
        },
        {
          "kind": "transfer-story",
          "names": [
            "胖虎",
            "团团"
          ],
          "values": [
            10,
            12
          ],
          "unit": "个",
          "illustrative": true,
          "action": "",
          "title": "先想一想",
          "footer": "原差＝移后差＋20。"
        },
        {
          "kind": "transfer-story",
          "names": [
            "胖虎",
            "团团"
          ],
          "values": [
            20,
            2
          ],
          "unit": "个",
          "illustrative": true,
          "action": "",
          "title": "倒推原来多18个",
          "footer": "负2加20＝18。"
        },
        {
          "kind": "transfer-story",
          "names": [
            "胖虎",
            "团团"
          ],
          "values": [
            10,
            12
          ],
          "unit": "个",
          "illustrative": true,
          "action": "",
          "title": "再移10个检查",
          "footer": "原来差18，移后差负2。"
        }
      ]
    },
    "steps": [
      {
        "title": "确定现在谁更多",
        "caption": "胖虎给10个后，团团多2个。",
        "narration": "胖虎给团团10个蛋挞以后，团团反而多2个。先固定比较方向，始终用胖虎减团团。"
      },
      {
        "title": "现在的差是负2",
        "caption": "给10个让有向差减少20。",
        "narration": "现在胖虎少2，记作负2。给出10个让胖虎减少10、团团增加10，差一共减少20。"
      },
      {
        "title": "先想一想",
        "caption": "原差＝移后差＋20。",
        "narration": "从现在胖虎少2开始倒推，把差加回20。得到的是多18，还是多22？",
        "question": {
          "prompt": "原来胖虎多多少个？",
          "choices": [
            "18个",
            "22个",
            "8个"
          ],
          "answer": 0,
          "explanation": "给出10个让差减少20，移后少2，所以原来多18。"
        }
      },
      {
        "title": "倒推原来多18个",
        "caption": "负2加20＝18。",
        "narration": "负2加20得到18。也可以想，移动造成20的变化，其中2用来反超，原来领先的就是20减2，等于18。",
        "formula": "10×2－2＝18（个）"
      },
      {
        "title": "再移10个检查",
        "caption": "原来差18，移后差负2。",
        "narration": "示例中胖虎20个、团团2个，移10个后是10和12。团团确实多2，原来胖虎多18。",
        "formula": "18－10×2＝－2"
      }
    ],
    "exercises": [
      {
        "id": "transfertartsref-1-a",
        "level": "举一反三",
        "prompt": "甲给乙7个点心后，乙反而比甲多4个。原来甲比乙多几个？",
        "answer": "10",
        "unit": "个",
        "hint": "原来差18，移后差负2。",
        "explanation": "7×2－4＝10个。"
      }
    ],
    "takeaway": "原来差18，移后差负2。",
    "mistakes": [
      "一件物品在两人之间移动，会让一方减少、另一方增加，数量差改变两件。",
      "倒推或改换移动方向时，先还原原来的状态；共同向外送出时不要当成互相转移。"
    ],
    "source": {
      "document": "数学原题分类汇编.docx",
      "question": "第8题",
      "paragraph": 21,
      "kind": "original"
    }
  },
  {
    "id": "transfercardsdirectionref-1",
    "version": 1,
    "grade": 1,
    "topic": "transfer",
    "title": "原题9·改换移送方向",
    "description": "原来12与18；给2后10与20，反给3后15与15。",
    "problem": "牛牛与小灵都有一些卡片，牛牛给小灵2张卡片之后，小灵比牛牛多10张卡片。如果改由小灵给牛牛卡片，给多少张后两人的卡片数相同？",
    "level": "原题挑战",
    "pathOrder": 109.0,
    "tags": [
      "原题挑战",
      "2026年10月原题汇编",
      "第9题"
    ],
    "scene": {
      "kind": "storyboard",
      "frames": [
        {
          "kind": "transfer-story",
          "names": [
            "牛牛",
            "小灵"
          ],
          "values": [
            12,
            18
          ],
          "unit": "张",
          "illustrative": true,
          "action": "",
          "title": "先还原原来的关系",
          "footer": "牛牛给2张后，小灵多10张。"
        },
        {
          "kind": "transfer-story",
          "names": [
            "牛牛",
            "小灵"
          ],
          "values": [
            10,
            20
          ],
          "unit": "张",
          "illustrative": true,
          "action": "",
          "title": "原来小灵多6张",
          "footer": "后来的10张差，含移动造成的4张。"
        },
        {
          "kind": "transfer-story",
          "names": [
            "牛牛",
            "小灵"
          ],
          "values": [
            12,
            18
          ],
          "unit": "张",
          "illustrative": true,
          "action": "",
          "title": "先想一想",
          "footer": "现在问的是从原来重新分。"
        },
        {
          "kind": "transfer-story",
          "names": [
            "牛牛",
            "小灵"
          ],
          "values": [
            15,
            15
          ],
          "unit": "张",
          "illustrative": true,
          "action": "",
          "title": "从多的一方移一半差",
          "footer": "小灵给牛牛3张后相等。"
        },
        {
          "kind": "transfer-story",
          "names": [
            "牛牛",
            "小灵"
          ],
          "values": [
            15,
            15
          ],
          "unit": "张",
          "illustrative": true,
          "action": "",
          "title": "分别检查两种方案",
          "footer": "原来12与18；给2后10与20，反给3后15与15。"
        }
      ]
    },
    "steps": [
      {
        "title": "先还原原来的关系",
        "caption": "牛牛给2张后，小灵多10张。",
        "narration": "牛牛给小灵2张之后，小灵多10张。如果改由小灵给牛牛，必须先还原原来的数量差。"
      },
      {
        "title": "原来小灵多6张",
        "caption": "后来的10张差，含移动造成的4张。",
        "narration": "牛牛给出2张，差向小灵一边增加4。把这4张扣掉，原来小灵只比牛牛多6张。",
        "formula": "10－2×2＝6（张）"
      },
      {
        "title": "先想一想",
        "caption": "现在问的是从原来重新分。",
        "narration": "改由小灵给牛牛，是回到原来的数量后重新移动，不是在已经给过2张的状态继续。原差应该用6还是10？",
        "question": {
          "prompt": "改方向前应使用哪个原差？",
          "choices": [
            "10张",
            "6张",
            "14张"
          ],
          "answer": 1,
          "explanation": "原来小灵多10－4＝6张。"
        }
      },
      {
        "title": "从多的一方移一半差",
        "caption": "小灵给牛牛3张后相等。",
        "narration": "从原来小灵多6张开始，每给牛牛1张，差缩小2张。6除以2是3，所以小灵应该给3张。",
        "formula": "6÷2＝3（张）"
      },
      {
        "title": "分别检查两种方案",
        "caption": "原来12与18；给2后10与20，反给3后15与15。",
        "narration": "看同一组原数，两种方案分别从12和18出发。牛牛给2张后差10；小灵给3张后各15。先还原，再改方向。",
        "formula": "（10－2×2）÷2＝3（张）"
      }
    ],
    "exercises": [
      {
        "id": "transfercardsdirectionref-1-a",
        "level": "举一反三",
        "prompt": "甲给乙3张卡片后乙多14张。如果改由乙给甲，给多少张后相等？",
        "answer": "4",
        "unit": "张",
        "hint": "原来12与18；给2后10与20，反给3后15与15。",
        "explanation": "原来乙多14－3×2＝8张，8÷2＝4张。"
      }
    ],
    "takeaway": "原来12与18；给2后10与20，反给3后15与15。",
    "mistakes": [
      "一件物品在两人之间移动，会让一方减少、另一方增加，数量差改变两件。",
      "倒推或改换移动方向时，先还原原来的状态；共同向外送出时不要当成互相转移。"
    ],
    "source": {
      "document": "数学原题分类汇编.docx",
      "question": "第9题",
      "paragraph": 23,
      "kind": "original"
    }
  },
  {
    "id": "transferpeachdifferenceref-1",
    "version": 1,
    "grade": 1,
    "topic": "transfer",
    "title": "原题10·给出以后少得更多",
    "description": "原少9，给出后少15。",
    "problem": "大刘给阿宝3个桃子后，大刘就比阿宝少15个桃子，原来大刘比阿宝少几个桃子？",
    "level": "原题挑战",
    "pathOrder": 110.0,
    "tags": [
      "原题挑战",
      "2026年10月原题汇编",
      "第10题"
    ],
    "scene": {
      "kind": "storyboard",
      "frames": [
        {
          "kind": "transfer-story",
          "names": [
            "大刘",
            "阿宝"
          ],
          "values": [
            8,
            23
          ],
          "unit": "个",
          "illustrative": true,
          "action": "",
          "title": "移后大刘少15个",
          "footer": "大刘给阿宝3个桃子。"
        },
        {
          "kind": "transfer-story",
          "names": [
            "大刘",
            "阿宝"
          ],
          "values": [
            8,
            23
          ],
          "unit": "个",
          "illustrative": true,
          "action": "",
          "title": "给出让劣势增加6",
          "footer": "自己少3，对方多3。"
        },
        {
          "kind": "transfer-story",
          "names": [
            "大刘",
            "阿宝"
          ],
          "values": [
            8,
            23
          ],
          "unit": "个",
          "illustrative": true,
          "action": "",
          "title": "先想一想",
          "footer": "倒推原来少几个，要扣除新增的6。"
        },
        {
          "kind": "transfer-story",
          "names": [
            "大刘",
            "阿宝"
          ],
          "values": [
            11,
            20
          ],
          "unit": "个",
          "illustrative": true,
          "action": "",
          "title": "求原来少9个",
          "footer": "15减6＝9。"
        },
        {
          "kind": "transfer-story",
          "names": [
            "大刘",
            "阿宝"
          ],
          "values": [
            8,
            23
          ],
          "unit": "个",
          "illustrative": true,
          "action": "",
          "title": "检查差是否扩大",
          "footer": "原少9，给出后少15。"
        }
      ]
    },
    "steps": [
      {
        "title": "移后大刘少15个",
        "caption": "大刘给阿宝3个桃子。",
        "narration": "大刘给阿宝3个桃子之后，比阿宝少15个。题目问原来少几个，不能把移后的15直接当答案。"
      },
      {
        "title": "给出让劣势增加6",
        "caption": "自己少3，对方多3。",
        "narration": "大刘少3个，阿宝多3个，少的数量增加6。原来比移后少的15，要少6。",
        "formula": "3×2＝6"
      },
      {
        "title": "先想一想",
        "caption": "倒推原来少几个，要扣除新增的6。",
        "narration": "给桃以后，两人的差扩大了6。还原到给桃之前，应该用15加6，还是15减6？",
        "question": {
          "prompt": "原来少几个怎样算？",
          "choices": [
            "15＋6",
            "15－6",
            "15－3"
          ],
          "answer": 1,
          "explanation": "扣掉给3个造成的6个新增差。"
        }
      },
      {
        "title": "求原来少9个",
        "caption": "15减6＝9。",
        "narration": "从15扣掉移动新增的6，剩9。原来大刘比阿宝少9个桃子。还原时别再往差上添加。",
        "formula": "15－3×2＝9（个）"
      },
      {
        "title": "检查差是否扩大",
        "caption": "原少9，给出后少15。",
        "narration": "示例原来11和20，相差9；大刘给3个后是8和23，相差15。倒推时，先判断移动让差扩大还是缩小。",
        "formula": "9＋3×2＝15"
      }
    ],
    "exercises": [
      {
        "id": "transferpeachdifferenceref-1-a",
        "level": "举一反三",
        "prompt": "甲给乙4个苹果后，甲比乙少19个，原来甲比乙少几个？",
        "answer": "11",
        "unit": "个",
        "hint": "原少9，给出后少15。",
        "explanation": "19－4×2＝11个。"
      }
    ],
    "takeaway": "原少9，给出后少15。",
    "mistakes": [
      "一件物品在两人之间移动，会让一方减少、另一方增加，数量差改变两件。",
      "倒推或改换移动方向时，先还原原来的状态；共同向外送出时不要当成互相转移。"
    ],
    "source": {
      "document": "数学原题分类汇编.docx",
      "question": "第10题",
      "paragraph": 25,
      "kind": "original"
    }
  },
  {
    "id": "transferdonationref-1",
    "version": 1,
    "grade": 1,
    "topic": "transfer",
    "title": "原题11·互送以后再共同送出",
    "description": "10加2＝12，10减2＝8。",
    "problem": "璐璐和团团原来有相同数量的糖果。10月1日，璐璐过生日，团团送给璐璐4颗糖果作为礼物。10月2日，璐璐和团团去幼儿园献爱心，一共送出了12颗糖果；此时他们的糖果数又相等了。那么，10月2日璐璐送出了多少颗糖果。",
    "level": "原题挑战",
    "pathOrder": 111.0,
    "tags": [
      "原题挑战",
      "2026年10月原题汇编",
      "第11题"
    ],
    "scene": {
      "kind": "storyboard",
      "frames": [
        {
          "kind": "transfer-story",
          "names": [
            "璐璐",
            "团团"
          ],
          "values": [
            24,
            16
          ],
          "unit": "颗",
          "illustrative": true,
          "action": "团团送璐璐4颗",
          "title": "生日后出现8颗差",
          "footer": "团团给璐璐4颗，璐璐多8颗。",
          "from": [
            20,
            20
          ]
        },
        {
          "kind": "transfer-story",
          "names": [
            "璐璐",
            "团团"
          ],
          "values": [
            24,
            16
          ],
          "unit": "颗",
          "illustrative": true,
          "action": "璐璐多8颗",
          "title": "献爱心后又相等",
          "footer": "璐璐必须比团团多送出8颗。"
        },
        {
          "kind": "transfer-story",
          "names": [
            "璐璐",
            "团团"
          ],
          "values": [
            24,
            16
          ],
          "unit": "颗",
          "illustrative": true,
          "action": "向外送糖",
          "title": "先想一想",
          "footer": "已知送出总数12，送出差8。"
        },
        {
          "kind": "transfer-story",
          "names": [
            "璐璐",
            "团团"
          ],
          "values": [
            14,
            14
          ],
          "unit": "颗",
          "illustrative": true,
          "action": "璐璐送10；团团送2",
          "title": "用和差求璐璐送出量",
          "footer": "璐璐送出10颗，团团送出2颗。"
        },
        {
          "kind": "transfer-story",
          "names": [
            "璐璐",
            "团团"
          ],
          "values": [
            14,
            14
          ],
          "unit": "颗",
          "illustrative": true,
          "action": "最后一样多",
          "title": "检查总数和最终相等",
          "footer": "10加2＝12，10减2＝8。"
        }
      ]
    },
    "steps": [
      {
        "title": "生日后出现8颗差",
        "caption": "团团给璐璐4颗，璐璐多8颗。",
        "narration": "原来两人糖果一样多。团团送璐璐4颗以后，璐璐增加4颗，团团减少4颗，所以璐璐多8颗。",
        "formula": "4×2＝8（颗）"
      },
      {
        "title": "献爱心后又相等",
        "caption": "璐璐必须比团团多送出8颗。",
        "narration": "第二天两人各向外送糖，最后相等。璐璐原来多8颗，就必须比团团多送出8颗。注意这次糖送到盘外。"
      },
      {
        "title": "先想一想",
        "caption": "已知送出总数12，送出差8。",
        "narration": "两人一共送12颗，璐璐比团团多送8颗。这变成了已知和与差，求较大的数。应该先加差还是减差？",
        "question": {
          "prompt": "璐璐比团团多送多少颗？",
          "choices": [
            "4颗",
            "8颗",
            "12颗"
          ],
          "answer": 1,
          "explanation": "生日后璐璐多8颗，所以要多送出8颗。"
        }
      },
      {
        "title": "用和差求璐璐送出量",
        "caption": "璐璐送出10颗，团团送出2颗。",
        "narration": "总数12加上差8，再平均分成两份，得到10。璐璐送出10颗，团团就是12减10，送出2颗。",
        "formula": "（12＋8）÷2＝10（颗）"
      },
      {
        "title": "检查总数和最终相等",
        "caption": "10加2＝12，10减2＝8。",
        "narration": "检查，两人一共送12，璐璐多送8，正好消掉生日后8颗的差。互送看两倍，向外送则比较各自减少多少。",
        "formula": "10＋2＝12；10－2＝8"
      }
    ],
    "exercises": [
      {
        "id": "transferdonationref-1-a",
        "level": "举一反三",
        "prompt": "两人原来糖果一样多，乙送甲3颗。后来两人一共向外送10颗后又相等。甲送多少颗？",
        "answer": "8",
        "unit": "颗",
        "hint": "10加2＝12，10减2＝8。",
        "explanation": "互送后甲多6颗；甲送出（10＋6）÷2＝8颗。"
      }
    ],
    "takeaway": "10加2＝12，10减2＝8。",
    "mistakes": [
      "一件物品在两人之间移动，会让一方减少、另一方增加，数量差改变两件。",
      "倒推或改换移动方向时，先还原原来的状态；共同向外送出时不要当成互相转移。"
    ],
    "source": {
      "document": "数学原题分类汇编.docx",
      "question": "第11题",
      "paragraph": 27,
      "kind": "original"
    }
  },
  {
    "id": "agesiblingsref-1",
    "version": 1,
    "grade": 1,
    "topic": "age",
    "title": "原题22·哥哥长大妹妹也长大",
    "description": "今年差9岁，未来仍差9岁。",
    "problem": "妹妹今年6岁，哥哥今年15岁，当哥哥21岁时，妹妹多少岁？",
    "level": "原题挑战",
    "pathOrder": 122.0,
    "tags": [
      "原题挑战",
      "2026年10月原题汇编",
      "第22题"
    ],
    "scene": {
      "kind": "storyboard",
      "frames": [
        {
          "kind": "age-story",
          "names": [
            "哥哥",
            "妹妹"
          ],
          "ages": [
            15,
            6
          ],
          "time": "今年",
          "masked": false,
          "title": "认清今年的年龄",
          "footer": "妹妹6岁，哥哥15岁。"
        },
        {
          "kind": "age-story",
          "names": [
            "哥哥",
            "妹妹"
          ],
          "ages": [
            15,
            6
          ],
          "time": "今年，准备向前6年",
          "masked": false,
          "title": "哥哥经过了几年",
          "footer": "21减15，经过6年。"
        },
        {
          "kind": "age-story",
          "names": [
            "哥哥",
            "妹妹"
          ],
          "ages": [
            16,
            7
          ],
          "time": "一年后示范",
          "masked": false,
          "title": "先想一想",
          "footer": "妹妹也要增加6岁。"
        },
        {
          "kind": "age-story",
          "names": [
            "哥哥",
            "妹妹"
          ],
          "ages": [
            21,
            12
          ],
          "time": "6年后",
          "masked": false,
          "title": "求妹妹的年龄",
          "footer": "妹妹那时12岁。"
        },
        {
          "kind": "age-story",
          "names": [
            "哥哥",
            "妹妹"
          ],
          "ages": [
            21,
            12
          ],
          "time": "6年后",
          "masked": false,
          "title": "用年龄差检查",
          "footer": "今年差9岁，未来仍差9岁。"
        }
      ]
    },
    "steps": [
      {
        "title": "认清今年的年龄",
        "caption": "妹妹6岁，哥哥15岁。",
        "narration": "妹妹今年6岁，哥哥15岁。哥哥长到21岁时，妹妹也会长大，不能只给哥哥增加年龄。"
      },
      {
        "title": "哥哥经过了几年",
        "caption": "21减15，经过6年。",
        "narration": "哥哥从15岁到21岁，增加6岁，说明时间过了6年。动画里，两条年龄线一起向前走。",
        "formula": "21－15＝6（年）"
      },
      {
        "title": "先想一想",
        "caption": "妹妹也要增加6岁。",
        "narration": "哥哥经过6年长到21岁，同样的6年里，妹妹是增加6岁，还是仍然停在6岁呢？",
        "question": {
          "prompt": "妹妹要增加几岁？",
          "choices": [
            "0岁",
            "6岁",
            "15岁"
          ],
          "answer": 1,
          "explanation": "同过6年，妹妹也增加6岁。"
        }
      },
      {
        "title": "求妹妹的年龄",
        "caption": "妹妹那时12岁。",
        "narration": "妹妹也增加6岁，6加6等于12。所以哥哥21岁的时候，妹妹是12岁。",
        "formula": "6＋6＝12（岁）"
      },
      {
        "title": "用年龄差检查",
        "caption": "今年差9岁，未来仍差9岁。",
        "narration": "今年15减6等于9，未来21减12也是9。先算经过几年，再给另一个人加上同样的年数。",
        "formula": "15－6＝21－12＝9"
      }
    ],
    "exercises": [
      {
        "id": "agesiblingsref-1-a",
        "level": "举一反三",
        "prompt": "弟弟今年7岁，姐姐16岁。当姐姐22岁时，弟弟多少岁？",
        "answer": "13",
        "unit": "岁",
        "hint": "今年差9岁，未来仍差9岁。",
        "explanation": "经过22－16＝6年，弟弟7＋6＝13岁。"
      }
    ],
    "takeaway": "今年差9岁，未来仍差9岁。",
    "mistakes": [
      "把不同时刻的年龄直接加减或套用倍数，没有先统一时间。",
      "只让一个人长大，或把年龄和增加的总岁数误当成经过的年数。"
    ],
    "source": {
      "document": "数学原题分类汇编.docx",
      "question": "第22题",
      "paragraph": 73,
      "kind": "original"
    }
  },
  {
    "id": "agefatherref-1",
    "version": 1,
    "grade": 1,
    "topic": "age",
    "title": "原题23·两人年龄和一起变",
    "description": "39加11＝50，年龄差仍是28。",
    "problem": "今年爸爸是32岁，儿子是4岁，当父子俩年龄之和是50岁时，爸爸和儿子各多少岁？",
    "level": "原题挑战",
    "pathOrder": 123.0,
    "tags": [
      "原题挑战",
      "2026年10月原题汇编",
      "第23题"
    ],
    "scene": {
      "kind": "storyboard",
      "frames": [
        {
          "kind": "age-story",
          "names": [
            "爸爸",
            "儿子"
          ],
          "ages": [
            32,
            4
          ],
          "time": "今年",
          "masked": false,
          "title": "先求今年年龄和",
          "footer": "父子今年一共36岁。"
        },
        {
          "kind": "age-story",
          "names": [
            "爸爸",
            "儿子"
          ],
          "ages": [
            33,
            5
          ],
          "time": "一年后示范",
          "masked": false,
          "title": "每年总和增加2",
          "footer": "每个人长1岁，两人合计长2岁。"
        },
        {
          "kind": "age-story",
          "names": [
            "爸爸",
            "儿子"
          ],
          "ages": [
            32,
            4
          ],
          "time": "回到今年求时间",
          "masked": false,
          "title": "先想一想",
          "footer": "总和增加14，对应7年。"
        },
        {
          "kind": "age-story",
          "names": [
            "爸爸",
            "儿子"
          ],
          "ages": [
            39,
            11
          ],
          "time": "7年后",
          "masked": false,
          "title": "两人都增加7岁",
          "footer": "爸爸39岁，儿子11岁。"
        },
        {
          "kind": "age-story",
          "names": [
            "爸爸",
            "儿子"
          ],
          "ages": [
            39,
            11
          ],
          "time": "7年后",
          "masked": false,
          "title": "检查年龄和与年龄差",
          "footer": "39加11＝50，年龄差仍是28。"
        }
      ]
    },
    "steps": [
      {
        "title": "先求今年年龄和",
        "caption": "父子今年一共36岁。",
        "narration": "爸爸32岁，儿子4岁，今年的年龄和是36岁。要让年龄和到50岁，还要增加14。",
        "formula": "32＋4＝36（岁）"
      },
      {
        "title": "每年总和增加2",
        "caption": "每个人长1岁，两人合计长2岁。",
        "narration": "过1年，爸爸增加1岁，儿子也增加1岁，总和增加2岁。不能把总和增加14误当成过了14年。"
      },
      {
        "title": "先想一想",
        "caption": "总和增加14，对应7年。",
        "narration": "两人的年龄和每年增加2。增加14需要几年？想一想，要用14除以几？",
        "question": {
          "prompt": "14岁总增量对应几年？",
          "choices": [
            "14年",
            "7年",
            "2年"
          ],
          "answer": 1,
          "explanation": "父子两人每年合计增加2岁，14÷2＝7年。"
        }
      },
      {
        "title": "两人都增加7岁",
        "caption": "爸爸39岁，儿子11岁。",
        "narration": "14除以2，经过7年。爸爸32加7是39，儿子4加7是11。两人都要加上7。",
        "formula": "（50－36）÷2＝7（年）"
      },
      {
        "title": "检查年龄和与年龄差",
        "caption": "39加11＝50，年龄差仍是28。",
        "narration": "39加11正好50，爸爸和儿子仍然相差28岁。两人年龄和每年增加2，这是这道题的关键。",
        "formula": "39＋11＝50"
      }
    ],
    "exercises": [
      {
        "id": "agefatherref-1-a",
        "level": "举一反三",
        "prompt": "爸爸30岁，儿子6岁。当父子年龄和为48岁时，儿子多少岁？",
        "answer": "12",
        "unit": "岁",
        "hint": "39加11＝50，年龄差仍是28。",
        "explanation": "今年和36，过（48－36）÷2＝6年，儿子6＋6＝12岁。"
      }
    ],
    "takeaway": "39加11＝50，年龄差仍是28。",
    "mistakes": [
      "把不同时刻的年龄直接加减或套用倍数，没有先统一时间。",
      "只让一个人长大，或把年龄和增加的总岁数误当成经过的年数。"
    ],
    "source": {
      "document": "数学原题分类汇编.docx",
      "question": "第23题",
      "paragraph": 75,
      "kind": "original"
    }
  },
  {
    "id": "agethreesumref-1",
    "version": 1,
    "grade": 1,
    "topic": "age",
    "title": "原题24·三人年龄和每年增3",
    "description": "10加13加14＝37。",
    "problem": "大刘今年7岁，团团今年10岁，胖虎今年11岁，当他们三人的年龄和为37岁时，他们三人各多少岁？",
    "level": "原题挑战",
    "pathOrder": 124.0,
    "tags": [
      "原题挑战",
      "2026年10月原题汇编",
      "第24题"
    ],
    "scene": {
      "kind": "storyboard",
      "frames": [
        {
          "kind": "age-story",
          "names": [
            "大刘",
            "团团",
            "胖虎"
          ],
          "ages": [
            7,
            10,
            11
          ],
          "time": "今年",
          "masked": false,
          "title": "算三人今年年龄和",
          "footer": "7加10加11＝28岁。"
        },
        {
          "kind": "age-story",
          "names": [
            "大刘",
            "团团",
            "胖虎"
          ],
          "ages": [
            8,
            11,
            12
          ],
          "time": "一年后示范",
          "masked": false,
          "title": "同过一年长3岁",
          "footer": "每个人加1，三人合计加3。"
        },
        {
          "kind": "age-story",
          "names": [
            "大刘",
            "团团",
            "胖虎"
          ],
          "ages": [
            7,
            10,
            11
          ],
          "time": "回到今年",
          "masked": false,
          "title": "先想一想",
          "footer": "9岁总增量要分给3个人。"
        },
        {
          "kind": "age-story",
          "names": [
            "大刘",
            "团团",
            "胖虎"
          ],
          "ages": [
            10,
            13,
            14
          ],
          "time": "3年后",
          "masked": false,
          "title": "每个人都增加3",
          "footer": "大刘10岁、团团13岁、胖虎14岁。"
        },
        {
          "kind": "age-story",
          "names": [
            "大刘",
            "团团",
            "胖虎"
          ],
          "ages": [
            10,
            13,
            14
          ],
          "time": "3年后",
          "masked": false,
          "title": "三个人一起核对",
          "footer": "10加13加14＝37。"
        }
      ]
    },
    "steps": [
      {
        "title": "算三人今年年龄和",
        "caption": "7加10加11＝28岁。",
        "narration": "大刘7岁，团团10岁，胖虎11岁。今年三人的年龄和是28岁，要达到37岁，一共需要增加9岁。",
        "formula": "7＋10＋11＝28（岁）"
      },
      {
        "title": "同过一年长3岁",
        "caption": "每个人加1，三人合计加3。",
        "narration": "动画里每个人同时增加1岁，三人的总年龄就增加3岁。人数是3，所以总增量要除以3。"
      },
      {
        "title": "先想一想",
        "caption": "9岁总增量要分给3个人。",
        "narration": "总和从28到37，增加9岁。这9岁是三个人共同增加的，经过几年呢？",
        "question": {
          "prompt": "三人年龄和每年增加几岁？",
          "choices": [
            "1岁",
            "2岁",
            "3岁"
          ],
          "answer": 2,
          "explanation": "三人各增加1岁，共增加3岁。"
        }
      },
      {
        "title": "每个人都增加3",
        "caption": "大刘10岁、团团13岁、胖虎14岁。",
        "narration": "9除以3，经过3年。分别给7、10、11加3，得到10、13、14岁。",
        "formula": "（37－28）÷3＝3（年）"
      },
      {
        "title": "三个人一起核对",
        "caption": "10加13加14＝37。",
        "narration": "三人的年龄和确实是37，每个人都比现在大3岁。几个人一起长大，总年龄每年就增加几岁。",
        "formula": "10＋13＋14＝37"
      }
    ],
    "exercises": [
      {
        "id": "agethreesumref-1-a",
        "level": "举一反三",
        "prompt": "三人今年分别5、8、11岁，当三人年龄和30岁时，最小的几岁？",
        "answer": "7",
        "unit": "岁",
        "hint": "10加13加14＝37。",
        "explanation": "今年和24，经过（30－24）÷3＝2年，最小5＋2＝7岁。"
      }
    ],
    "takeaway": "10加13加14＝37。",
    "mistakes": [
      "把不同时刻的年龄直接加减或套用倍数，没有先统一时间。",
      "只让一个人长大，或把年龄和增加的总岁数误当成经过的年数。"
    ],
    "source": {
      "document": "数学原题分类汇编.docx",
      "question": "第24题",
      "paragraph": 77,
      "kind": "original"
    }
  },
  {
    "id": "agefathertwosonsref-1",
    "version": 1,
    "grade": 1,
    "topic": "age",
    "title": "原题25·父亲与两个儿子的年龄和",
    "description": "未来父亲60岁，两儿子合计60岁。",
    "problem": "父亲与两个儿子的年龄和为84岁，12年后父亲的年龄正好等于两个儿子的年龄和，父亲现在多少岁？",
    "level": "原题挑战",
    "pathOrder": 125.0,
    "tags": [
      "原题挑战",
      "2026年10月原题汇编",
      "第25题"
    ],
    "scene": {
      "kind": "storyboard",
      "frames": [
        {
          "kind": "age-story",
          "names": [
            "父亲",
            "两儿子合计"
          ],
          "ages": [
            48,
            36
          ],
          "time": "今年",
          "masked": true,
          "rule": "父亲每年加1岁；两个儿子合计每年加2岁",
          "title": "先比较变化速度",
          "footer": "父亲每年增1岁，两儿子合计每年增2岁。"
        },
        {
          "kind": "age-story",
          "names": [
            "父亲",
            "两儿子合计"
          ],
          "ages": [
            48,
            36
          ],
          "time": "每年增加1与2",
          "masked": true,
          "rule": "父亲每年加1岁；两个儿子合计每年加2岁",
          "title": "12年多追上12岁",
          "footer": "儿子合计增24，父亲增12。"
        },
        {
          "kind": "age-story",
          "names": [
            "父亲",
            "两儿子合计"
          ],
          "ages": [
            48,
            36
          ],
          "time": "回到今年比较",
          "masked": true,
          "rule": "父亲每年加1岁；两个儿子合计每年加2岁",
          "title": "先想一想",
          "footer": "父亲现在比两儿子合计大12岁。"
        },
        {
          "kind": "age-story",
          "names": [
            "父亲",
            "两儿子合计"
          ],
          "ages": [
            48,
            36
          ],
          "time": "今年，解得年龄",
          "masked": false,
          "rule": "父亲每年加1岁；两个儿子合计每年加2岁",
          "title": "用和差求父亲年龄",
          "footer": "父亲现在48岁，两儿子合计36岁。"
        },
        {
          "kind": "age-story",
          "names": [
            "父亲",
            "两儿子合计"
          ],
          "ages": [
            60,
            60
          ],
          "time": "12年后",
          "masked": false,
          "rule": "父亲每年加1岁；两个儿子合计每年加2岁",
          "title": "把12年都加进去",
          "footer": "未来父亲60岁，两儿子合计60岁。"
        }
      ]
    },
    "steps": [
      {
        "title": "先比较变化速度",
        "caption": "父亲每年增1岁，两儿子合计每年增2岁。",
        "narration": "父亲和两个儿子的年龄和是84。12年后，父亲年龄等于两个儿子的年龄和。两边不是同样速度增加。"
      },
      {
        "title": "12年多追上12岁",
        "caption": "儿子合计增24，父亲增12。",
        "narration": "12年后，父亲增加12岁，两个儿子合计增加24岁。儿子这一边比父亲多增加12岁，恰好追成相等。",
        "formula": "24－12＝12（岁）"
      },
      {
        "title": "先想一想",
        "caption": "父亲现在比两儿子合计大12岁。",
        "narration": "12年后能相等，说明现在父亲比两个儿子合计大多少岁？是12岁还是24岁？",
        "question": {
          "prompt": "父亲现在比两儿子合计大多少岁？",
          "choices": [
            "12岁",
            "24岁",
            "36岁"
          ],
          "answer": 0,
          "explanation": "未来12年，儿子合计比父亲多增加12岁，才能追平。"
        }
      },
      {
        "title": "用和差求父亲年龄",
        "caption": "父亲现在48岁，两儿子合计36岁。",
        "narration": "现在两边的和是84，差是12。较大的父亲年龄，用84加12再除以2，得到48岁。",
        "formula": "（84＋12）÷2＝48（岁）"
      },
      {
        "title": "把12年都加进去",
        "caption": "未来父亲60岁，两儿子合计60岁。",
        "narration": "检查，父亲48加12是60；两儿子合计36加24也是60。题目只能确定两个儿子的年龄和，不能确定每人几岁。",
        "formula": "48＋12＝36＋12×2＝60"
      }
    ],
    "exercises": [
      {
        "id": "agefathertwosonsref-1-a",
        "level": "举一反三",
        "prompt": "父亲与两儿子年龄和72岁，8年后父亲等于两儿子年龄和。父亲现在几岁？",
        "answer": "40",
        "unit": "岁",
        "hint": "未来父亲60岁，两儿子合计60岁。",
        "explanation": "现在父亲比两儿子合计大8岁，（72＋8）÷2＝40岁。"
      }
    ],
    "takeaway": "未来父亲60岁，两儿子合计60岁。",
    "mistakes": [
      "把不同时刻的年龄直接加减或套用倍数，没有先统一时间。",
      "只让一个人长大，或把年龄和增加的总岁数误当成经过的年数。"
    ],
    "source": {
      "document": "数学原题分类汇编.docx",
      "question": "第25题",
      "paragraph": 81,
      "kind": "original"
    }
  },
  {
    "id": "agesistercomparisonref-1",
    "version": 1,
    "grade": 1,
    "topic": "age",
    "title": "原题26·跨时刻比较姐妹年龄",
    "description": "未来妹妹18岁，姐姐24岁。",
    "problem": "妹妹今年12岁，当她像姐姐今年这么大时，姐姐24岁，姐姐今年多少岁？",
    "level": "原题挑战",
    "pathOrder": 126.0,
    "tags": [
      "原题挑战",
      "2026年10月原题汇编",
      "第26题"
    ],
    "scene": {
      "kind": "storyboard",
      "frames": [
        {
          "kind": "age-story",
          "names": [
            "姐姐",
            "妹妹"
          ],
          "ages": [
            18,
            12
          ],
          "time": "今年",
          "masked": true,
          "title": "两个时刻分开看",
          "footer": "妹妹今年12岁，未来姐姐24岁。"
        },
        {
          "kind": "age-story",
          "names": [
            "姐姐",
            "妹妹"
          ],
          "ages": [
            18,
            12
          ],
          "time": "经过一个年龄差",
          "masked": true,
          "title": "两次变化都是年龄差",
          "footer": "妹妹追到姐姐今年年龄，要经过一个年龄差。"
        },
        {
          "kind": "age-story",
          "names": [
            "姐姐",
            "妹妹"
          ],
          "ages": [
            18,
            12
          ],
          "time": "两段相同的时间",
          "masked": true,
          "title": "先想一想",
          "footer": "从12到24，跨了两个相同的年龄差。"
        },
        {
          "kind": "age-story",
          "names": [
            "姐姐",
            "妹妹"
          ],
          "ages": [
            18,
            12
          ],
          "time": "今年解得年龄",
          "masked": false,
          "title": "把12岁的跨度平分",
          "footer": "年龄差6岁，姐姐今年18岁。"
        },
        {
          "kind": "age-story",
          "names": [
            "姐姐",
            "妹妹"
          ],
          "ages": [
            24,
            18
          ],
          "time": "6年后",
          "masked": false,
          "title": "用同过6年检查",
          "footer": "未来妹妹18岁，姐姐24岁。"
        }
      ]
    },
    "steps": [
      {
        "title": "两个时刻分开看",
        "caption": "妹妹今年12岁，未来姐姐24岁。",
        "narration": "妹妹今年12岁。等妹妹长到姐姐今年这么大，姐姐已经24岁。注意两个年龄说的是不同的时刻。"
      },
      {
        "title": "两次变化都是年龄差",
        "caption": "妹妹追到姐姐今年年龄，要经过一个年龄差。",
        "narration": "把姐妹的年龄差想成一段时间。妹妹长到姐姐今年的年龄，需要这段时间；姐姐也同时长了同样一段。"
      },
      {
        "title": "先想一想",
        "caption": "从12到24，跨了两个相同的年龄差。",
        "narration": "妹妹今年12，姐姐未来24。从12到姐姐今年，再到姐姐未来，中间有几段相同的年龄差？",
        "question": {
          "prompt": "12到24包含几段年龄差？",
          "choices": [
            "1段",
            "2段",
            "3段"
          ],
          "answer": 1,
          "explanation": "妹妹到姐姐今年年龄是一段，姐姐继续到24又是一段。"
        }
      },
      {
        "title": "把12岁的跨度平分",
        "caption": "年龄差6岁，姐姐今年18岁。",
        "narration": "24减12是12，对应两段年龄差。每段6岁，姐姐今年就是12加6，等于18岁。",
        "formula": "（24－12）÷2＝6；12＋6＝18"
      },
      {
        "title": "用同过6年检查",
        "caption": "未来妹妹18岁，姐姐24岁。",
        "narration": "今年妹妹12、姐姐18，过6年妹妹18，正好等于姐姐今年；姐姐同时24，符合题意。",
        "formula": "18＋6＝24；12＋6＝18"
      }
    ],
    "exercises": [
      {
        "id": "agesistercomparisonref-1-a",
        "level": "举一反三",
        "prompt": "妹妹今年10岁，当她像姐姐今年这么大时，姐姐22岁。姐姐今年多少岁？",
        "answer": "16",
        "unit": "岁",
        "hint": "未来妹妹18岁，姐姐24岁。",
        "explanation": "（22－10）÷2＝6岁年龄差，姐姐10＋6＝16岁。"
      }
    ],
    "takeaway": "未来妹妹18岁，姐姐24岁。",
    "mistakes": [
      "把不同时刻的年龄直接加减或套用倍数，没有先统一时间。",
      "只让一个人长大，或把年龄和增加的总岁数误当成经过的年数。"
    ],
    "source": {
      "document": "数学原题分类汇编.docx",
      "question": "第26题",
      "paragraph": 83,
      "kind": "original"
    }
  },
  {
    "id": "agemotherfourref-1",
    "version": 1,
    "grade": 1,
    "topic": "age",
    "title": "原题27·年龄差与四倍时刻",
    "description": "32是8的4倍，32减8等于24。",
    "problem": "今年妈妈比牛牛大24岁，当妈妈的年龄是牛牛年龄的4倍时，两人分别多少岁？",
    "level": "原题挑战",
    "pathOrder": 127.0,
    "tags": [
      "原题挑战",
      "2026年10月原题汇编",
      "第27题"
    ],
    "scene": {
      "kind": "storyboard",
      "frames": [
        {
          "kind": "age-story",
          "names": [
            "妈妈",
            "牛牛"
          ],
          "ages": [
            32,
            8
          ],
          "time": "四倍时刻",
          "masked": true,
          "title": "年龄差24不会变",
          "footer": "求的是妈妈为牛牛4倍的那个时刻。"
        },
        {
          "kind": "age-story",
          "names": [
            "妈妈",
            "牛牛"
          ],
          "ages": [
            32,
            8
          ],
          "time": "四倍时刻分份",
          "masked": true,
          "title": "用份数表示两人",
          "footer": "牛牛1份，妈妈4份，相差3份。"
        },
        {
          "kind": "age-story",
          "names": [
            "妈妈",
            "牛牛"
          ],
          "ages": [
            32,
            8
          ],
          "time": "24岁差对应3份",
          "masked": true,
          "title": "先想一想",
          "footer": "24岁年龄差对应3份。"
        },
        {
          "kind": "age-story",
          "names": [
            "妈妈",
            "牛牛"
          ],
          "ages": [
            32,
            8
          ],
          "time": "四倍时刻解得年龄",
          "masked": false,
          "title": "求每份与四份",
          "footer": "牛牛8岁，妈妈32岁。"
        },
        {
          "kind": "age-story",
          "names": [
            "妈妈",
            "牛牛"
          ],
          "ages": [
            32,
            8
          ],
          "time": "核对四倍时刻",
          "masked": false,
          "title": "同时检查倍数和差",
          "footer": "32是8的4倍，32减8等于24。"
        }
      ]
    },
    "steps": [
      {
        "title": "年龄差24不会变",
        "caption": "求的是妈妈为牛牛4倍的那个时刻。",
        "narration": "妈妈比牛牛大24岁。题目问4倍时各几岁，没有给今年各几岁，不要假定4倍时就是今年。"
      },
      {
        "title": "用份数表示两人",
        "caption": "牛牛1份，妈妈4份，相差3份。",
        "narration": "到了4倍的时刻，把牛牛年龄看成1份，妈妈是4份。两人的差是4减1，也就是3份。",
        "formula": "4－1＝3（份）"
      },
      {
        "title": "先想一想",
        "caption": "24岁年龄差对应3份。",
        "narration": "年龄差24岁，对应4份还是3份？妈妈多出来的部分，才是两人的年龄差。",
        "question": {
          "prompt": "年龄差对应几份？",
          "choices": [
            "4份",
            "3份",
            "1份"
          ],
          "answer": 1,
          "explanation": "4份减1份，差对应3份。"
        }
      },
      {
        "title": "求每份与四份",
        "caption": "牛牛8岁，妈妈32岁。",
        "narration": "24除以3，每份8岁。牛牛1份是8岁，妈妈4份就是32岁。",
        "formula": "24÷3＝8；8×4＝32"
      },
      {
        "title": "同时检查倍数和差",
        "caption": "32是8的4倍，32减8等于24。",
        "narration": "检查，32除以8是4，32减8是24，两条条件都满足。答案是那个时刻妈妈32岁、牛牛8岁。",
        "formula": "32÷8＝4；32－8＝24"
      }
    ],
    "exercises": [
      {
        "id": "agemotherfourref-1-a",
        "level": "举一反三",
        "prompt": "妈妈比孩子大30岁。当妈妈年龄是孩子4倍时，孩子多少岁？",
        "answer": "10",
        "unit": "岁",
        "hint": "32是8的4倍，32减8等于24。",
        "explanation": "30÷（4－1）＝10岁。"
      }
    ],
    "takeaway": "32是8的4倍，32减8等于24。",
    "mistakes": [
      "把不同时刻的年龄直接加减或套用倍数，没有先统一时间。",
      "只让一个人长大，或把年龄和增加的总岁数误当成经过的年数。"
    ],
    "source": {
      "document": "数学原题分类汇编.docx",
      "question": "第27题",
      "paragraph": 85,
      "kind": "original"
    }
  },
  {
    "id": "agepastsumratioref-1",
    "version": 1,
    "grade": 1,
    "topic": "age",
    "title": "原题28·两年前的和换到今年",
    "description": "爸爸38岁、儿子8岁，和46。",
    "problem": "两年前父子两人的年龄和是46岁，今年爸爸的年龄是儿子年龄的4倍，那么两人今年分别多少岁？",
    "level": "原题挑战",
    "pathOrder": 128.0,
    "tags": [
      "原题挑战",
      "2026年10月原题汇编",
      "第28题"
    ],
    "scene": {
      "kind": "storyboard",
      "frames": [
        {
          "kind": "age-story",
          "names": [
            "爸爸",
            "儿子"
          ],
          "ages": [
            38,
            8
          ],
          "time": "两年前",
          "masked": true,
          "title": "先把年龄和换到今年",
          "footer": "两年前和46，今年和50。"
        },
        {
          "kind": "age-story",
          "names": [
            "爸爸",
            "儿子"
          ],
          "ages": [
            40,
            10
          ],
          "time": "今年",
          "masked": true,
          "title": "今年按四倍分份",
          "footer": "爸爸4份，儿子1份，一共5份。"
        },
        {
          "kind": "age-story",
          "names": [
            "爸爸",
            "儿子"
          ],
          "ages": [
            40,
            10
          ],
          "time": "今年按五份分",
          "masked": true,
          "title": "先想一想",
          "footer": "今年50岁要分成5份。"
        },
        {
          "kind": "age-story",
          "names": [
            "爸爸",
            "儿子"
          ],
          "ages": [
            40,
            10
          ],
          "time": "今年解得年龄",
          "masked": false,
          "title": "求儿子和爸爸今年年龄",
          "footer": "儿子10岁，爸爸40岁。"
        },
        {
          "kind": "age-story",
          "names": [
            "爸爸",
            "儿子"
          ],
          "ages": [
            38,
            8
          ],
          "time": "回到两年前检查",
          "masked": false,
          "title": "退回两年前检查",
          "footer": "爸爸38岁、儿子8岁，和46。"
        }
      ]
    },
    "steps": [
      {
        "title": "先把年龄和换到今年",
        "caption": "两年前和46，今年和50。",
        "narration": "两年前父子年龄和46。到今年，两人各增加2岁，一共增加4，所以今年年龄和是50。",
        "formula": "46＋2×2＝50（岁）"
      },
      {
        "title": "今年按四倍分份",
        "caption": "爸爸4份，儿子1份，一共5份。",
        "narration": "今年爸爸是儿子的4倍。把今年儿子看1份，爸爸4份，两人合计5份。注意倍数条件发生在今年。",
        "formula": "4＋1＝5（份）"
      },
      {
        "title": "先想一想",
        "caption": "今年50岁要分成5份。",
        "narration": "要用4倍关系分今年的年龄和，应该用两年前的46，还是今年的50呢？",
        "question": {
          "prompt": "分份时应该用哪个年龄和？",
          "choices": [
            "46岁",
            "50岁",
            "48岁"
          ],
          "answer": 1,
          "explanation": "两人各长2岁，今年和50。"
        }
      },
      {
        "title": "求儿子和爸爸今年年龄",
        "caption": "儿子10岁，爸爸40岁。",
        "narration": "50除以5，每份10岁，儿子今年10岁，爸爸4份是40岁。这两个年龄都对应今年。",
        "formula": "50÷5＝10；10×4＝40"
      },
      {
        "title": "退回两年前检查",
        "caption": "爸爸38岁、儿子8岁，和46。",
        "narration": "两年前分别38和8，相加46；今年40和10，正好4倍。先统一到同一个时刻，再用倍数关系。",
        "formula": "38＋8＝46；40÷10＝4"
      }
    ],
    "exercises": [
      {
        "id": "agepastsumratioref-1-a",
        "level": "举一反三",
        "prompt": "两年前父子年龄和40岁，今年爸爸是儿子3倍。儿子今年几岁？",
        "answer": "11",
        "unit": "岁",
        "hint": "爸爸38岁、儿子8岁，和46。",
        "explanation": "今年和40＋4＝44岁，44÷（3＋1）＝11岁。"
      }
    ],
    "takeaway": "爸爸38岁、儿子8岁，和46。",
    "mistakes": [
      "把不同时刻的年龄直接加减或套用倍数，没有先统一时间。",
      "只让一个人长大，或把年龄和增加的总岁数误当成经过的年数。"
    ],
    "source": {
      "document": "数学原题分类汇编.docx",
      "question": "第28题",
      "paragraph": 87,
      "kind": "original"
    }
  },
  {
    "id": "ageeightyearspanref-1",
    "version": 1,
    "grade": 1,
    "topic": "age",
    "title": "原题29·从四年后倒回四年前",
    "description": "过去28与4；未来36与12。",
    "problem": "4年前王叔叔的年龄是牛牛的7倍，4年后两人的年龄和是48岁，那么牛牛今年多少岁？",
    "level": "原题挑战",
    "pathOrder": 129.0,
    "tags": [
      "原题挑战",
      "2026年10月原题汇编",
      "第29题"
    ],
    "scene": {
      "kind": "storyboard",
      "frames": [
        {
          "kind": "age-story",
          "names": [
            "王叔叔",
            "牛牛"
          ],
          "ages": [
            36,
            12
          ],
          "time": "4年后",
          "masked": true,
          "title": "两个条件相隔8年",
          "footer": "4年前7倍，4年后和48。"
        },
        {
          "kind": "age-story",
          "names": [
            "王叔叔",
            "牛牛"
          ],
          "ages": [
            28,
            4
          ],
          "time": "倒回4年前",
          "masked": true,
          "title": "求4年前的年龄和",
          "footer": "48减去两人各8岁，过去和32。"
        },
        {
          "kind": "age-story",
          "names": [
            "王叔叔",
            "牛牛"
          ],
          "ages": [
            28,
            4
          ],
          "time": "4年前分八份",
          "masked": true,
          "title": "先想一想",
          "footer": "过去叔叔7份、牛牛1份，共8份。"
        },
        {
          "kind": "age-story",
          "names": [
            "王叔叔",
            "牛牛"
          ],
          "ages": [
            32,
            8
          ],
          "time": "今年",
          "masked": false,
          "title": "先求过去再回今年",
          "footer": "牛牛4年前4岁，今年8岁。"
        },
        {
          "kind": "age-story",
          "names": [
            "王叔叔",
            "牛牛"
          ],
          "ages": [
            36,
            12
          ],
          "time": "回到4年后检查",
          "masked": false,
          "title": "两端条件都检查",
          "footer": "过去28与4；未来36与12。"
        }
      ]
    },
    "steps": [
      {
        "title": "两个条件相隔8年",
        "caption": "4年前7倍，4年后和48。",
        "narration": "4年前和4年后，相隔8年，不是4年。我们先把未来的年龄和倒回过去，再使用7倍关系。"
      },
      {
        "title": "求4年前的年龄和",
        "caption": "48减去两人各8岁，过去和32。",
        "narration": "从4年后退到4年前，两人各少8岁，年龄和少16。48减16等于32。",
        "formula": "48－8×2＝32（岁）"
      },
      {
        "title": "先想一想",
        "caption": "过去叔叔7份、牛牛1份，共8份。",
        "narration": "4年前王叔叔是牛牛的7倍。两人的年龄和32岁，要分成7份还是8份呢？",
        "question": {
          "prompt": "4年前的年龄和应该分几份？",
          "choices": [
            "7份",
            "8份",
            "6份"
          ],
          "answer": 1,
          "explanation": "叔叔7份加牛牛1份，共8份。"
        }
      },
      {
        "title": "先求过去再回今年",
        "caption": "牛牛4年前4岁，今年8岁。",
        "narration": "32除以8，牛牛4年前是4岁。题目问今年，再加上4年，牛牛今年8岁。",
        "formula": "32÷8＋4＝8（岁）"
      },
      {
        "title": "两端条件都检查",
        "caption": "过去28与4；未来36与12。",
        "narration": "牛牛今年8岁，叔叔32岁。4年前28是4的7倍；4年后36加12等于48。两个条件同时成立。",
        "formula": "28÷4＝7；36＋12＝48"
      }
    ],
    "exercises": [
      {
        "id": "ageeightyearspanref-1-a",
        "level": "举一反三",
        "prompt": "3年前叔叔是孩子5倍，3年后两人和42岁。孩子今年多少岁？",
        "answer": "8",
        "unit": "岁",
        "hint": "过去28与4；未来36与12。",
        "explanation": "前后相隔6年，两人共差12岁；3年前和30，孩子30÷6＝5岁，今年8岁。"
      }
    ],
    "takeaway": "过去28与4；未来36与12。",
    "mistakes": [
      "把不同时刻的年龄直接加减或套用倍数，没有先统一时间。",
      "只让一个人长大，或把年龄和增加的总岁数误当成经过的年数。"
    ],
    "source": {
      "document": "数学原题分类汇编.docx",
      "question": "第29题",
      "paragraph": 89,
      "kind": "original"
    }
  },
  {
    "id": "ageadultsistersref-1",
    "version": 1,
    "grade": 1,
    "topic": "age",
    "title": "原题30·两个相等的年龄跨度",
    "description": "妹妹26、姐姐32，符合题意。",
    "problem": "妹妹今年20岁，当妹妹像姐姐今年这么大时，姐姐已经32岁了，那么姐姐今年多少岁？",
    "level": "原题挑战",
    "pathOrder": 130.0,
    "tags": [
      "原题挑战",
      "2026年10月原题汇编",
      "第30题"
    ],
    "scene": {
      "kind": "storyboard",
      "frames": [
        {
          "kind": "age-story",
          "names": [
            "姐姐",
            "妹妹"
          ],
          "ages": [
            26,
            20
          ],
          "time": "今年",
          "masked": true,
          "title": "区分今年和将来",
          "footer": "妹妹今年20岁，姐姐将来32岁。"
        },
        {
          "kind": "age-story",
          "names": [
            "姐姐",
            "妹妹"
          ],
          "ages": [
            26,
            20
          ],
          "time": "一个年龄差的时间",
          "masked": true,
          "title": "把时间画成两段",
          "footer": "20到姐姐今年，再到32，间隔相等。"
        },
        {
          "kind": "age-story",
          "names": [
            "姐姐",
            "妹妹"
          ],
          "ages": [
            26,
            20
          ],
          "time": "平分两段时间",
          "masked": true,
          "title": "先想一想",
          "footer": "20到32的12岁要平分成两段。"
        },
        {
          "kind": "age-story",
          "names": [
            "姐姐",
            "妹妹"
          ],
          "ages": [
            26,
            20
          ],
          "time": "今年解得年龄",
          "masked": false,
          "title": "求姐姐今年26岁",
          "footer": "年龄差6岁，姐姐今年20加6。"
        },
        {
          "kind": "age-story",
          "names": [
            "姐姐",
            "妹妹"
          ],
          "ages": [
            32,
            26
          ],
          "time": "6年后",
          "masked": false,
          "title": "同时向未来走6年",
          "footer": "妹妹26、姐姐32，符合题意。"
        }
      ]
    },
    "steps": [
      {
        "title": "区分今年和将来",
        "caption": "妹妹今年20岁，姐姐将来32岁。",
        "narration": "妹妹今年20岁。将来妹妹等于姐姐今年年龄的时候，姐姐32岁。条件和前面的跨时刻题一样，只是数字变了。"
      },
      {
        "title": "把时间画成两段",
        "caption": "20到姐姐今年，再到32，间隔相等。",
        "narration": "妹妹从20长到姐姐今年的年龄，需要一个年龄差的时间。姐姐同时也长一个年龄差，两段时间一样长。"
      },
      {
        "title": "先想一想",
        "caption": "20到32的12岁要平分成两段。",
        "narration": "20到32相差12，这12对应两段相等的跨度。每段应该是多少岁呢？",
        "question": {
          "prompt": "12岁的跨度每段多少岁？",
          "choices": [
            "12岁",
            "6岁",
            "4岁"
          ],
          "answer": 1,
          "explanation": "12÷2＝6岁。"
        }
      },
      {
        "title": "求姐姐今年26岁",
        "caption": "年龄差6岁，姐姐今年20加6。",
        "narration": "12除以2，年龄差6岁。姐姐今年20加6，等于26岁。接下来要到将来核对。",
        "formula": "（32－20）÷2＝6；20＋6＝26"
      },
      {
        "title": "同时向未来走6年",
        "caption": "妹妹26、姐姐32，符合题意。",
        "narration": "今年姐妹是20和26，6年后妹妹26，等于姐姐今年；姐姐32。年龄差始终6岁。",
        "formula": "20＋6＝26；26＋6＝32"
      }
    ],
    "exercises": [
      {
        "id": "ageadultsistersref-1-a",
        "level": "举一反三",
        "prompt": "妹妹今年16岁，她像姐姐今年这么大时，姐姐28岁。姐姐今年多少岁？",
        "answer": "22",
        "unit": "岁",
        "hint": "妹妹26、姐姐32，符合题意。",
        "explanation": "年龄差（28－16）÷2＝6，姐姐16＋6＝22岁。"
      }
    ],
    "takeaway": "妹妹26、姐姐32，符合题意。",
    "mistakes": [
      "把不同时刻的年龄直接加减或套用倍数，没有先统一时间。",
      "只让一个人长大，或把年龄和增加的总岁数误当成经过的年数。"
    ],
    "source": {
      "document": "数学原题分类汇编.docx",
      "question": "第30题",
      "paragraph": 91,
      "kind": "original"
    }
  },
  {
    "id": "agecrossratioref-1",
    "version": 1,
    "grade": 1,
    "topic": "age",
    "title": "原题31·三个时刻的年龄倍数",
    "description": "今年牛牛25岁、团团15岁。",
    "problem": "当牛牛像团团那样大的时候，牛牛的年龄是团团的3倍；当团团到了牛牛现在的年龄时，牛牛是团团的2倍少15岁，那么现在牛牛、团团年龄分别是多少岁？",
    "level": "原题挑战",
    "pathOrder": 131.0,
    "tags": [
      "原题挑战",
      "2026年10月原题汇编",
      "第31题"
    ],
    "scene": {
      "kind": "storyboard",
      "frames": [
        {
          "kind": "bars",
          "rows": [
            {
              "label": "牛牛",
              "value": 5,
              "display": "5份"
            },
            {
              "label": "团团",
              "value": 3,
              "display": "3份"
            }
          ],
          "title": "把过去现在未来分开",
          "footer": "牛牛较大，前后各相隔一个年龄差。"
        },
        {
          "kind": "bars",
          "rows": [
            {
              "label": "牛牛",
              "value": 3,
              "display": "3份"
            },
            {
              "label": "团团",
              "value": 1,
              "display": "1份"
            }
          ],
          "title": "先用过去的三倍分份",
          "footer": "过去牛牛3份、团团1份，年龄差2份。"
        },
        {
          "kind": "bars",
          "rows": [
            {
              "label": "牛牛",
              "value": 7,
              "display": "7份"
            },
            {
              "label": "团团",
              "value": 5,
              "display": "5份"
            }
          ],
          "title": "先想一想",
          "footer": "到未来两人变成7份与5份。"
        },
        {
          "kind": "bars",
          "rows": [
            {
              "label": "牛牛",
              "value": 7,
              "display": "7份"
            },
            {
              "label": "团团",
              "value": 5,
              "display": "5份"
            }
          ],
          "title": "用少15岁求一份",
          "footer": "2个5份减7份＝3份，对应15岁。"
        },
        {
          "kind": "age-story",
          "names": [
            "牛牛",
            "团团"
          ],
          "ages": [
            25,
            15
          ],
          "time": "现在",
          "title": "回到今年并验证",
          "footer": "今年牛牛25岁、团团15岁。"
        }
      ]
    },
    "steps": [
      {
        "title": "把过去现在未来分开",
        "caption": "牛牛较大，前后各相隔一个年龄差。",
        "narration": "牛牛较大。过去牛牛等于团团现在的年龄；未来团团等于牛牛现在的年龄。前后移动的年数，都等于两人的年龄差。"
      },
      {
        "title": "先用过去的三倍分份",
        "caption": "过去牛牛3份、团团1份，年龄差2份。",
        "narration": "把过去团团的年龄当1份，牛牛是3份，所以年龄差2份。从过去走到现在，两人都增加2份。",
        "formula": "过去：3份与1份；现在：5份与3份"
      },
      {
        "title": "先想一想",
        "caption": "到未来两人变成7份与5份。",
        "narration": "现在牛牛5份、团团3份。再过同样的2份时间，未来两人分别几份？先把两个时刻的关系对齐。",
        "question": {
          "prompt": "未来牛牛、团团分别几份？",
          "choices": [
            "5份与3份",
            "7份与5份",
            "3份与1份"
          ],
          "answer": 1,
          "explanation": "过去3与1，现在5与3，未来7与5。"
        }
      },
      {
        "title": "用少15岁求一份",
        "caption": "2个5份减7份＝3份，对应15岁。",
        "narration": "未来牛牛7份，团团5份。牛牛比团团的2倍少15，所以10份减7份，3份是15岁，每份5岁。",
        "formula": "15÷（5×2－7）＝5（岁）"
      },
      {
        "title": "回到今年并验证",
        "caption": "今年牛牛25岁、团团15岁。",
        "narration": "今年是5份和3份，所以25和15岁。10年前15是5的3倍；10年后35恰好比25的2倍少15，全部符合。",
        "formula": "25－10＝3×（15－10）；35＝25×2－15"
      }
    ],
    "exercises": [
      {
        "id": "agecrossratioref-1-a",
        "level": "举一反三",
        "prompt": "甲今年是5份年龄，乙3份年龄。未来甲7份、乙5份，甲比乙的2倍少12岁。甲今年几岁？",
        "answer": "20",
        "unit": "岁",
        "hint": "今年牛牛25岁、团团15岁。",
        "explanation": "（5×2－7）份对应12岁，每份4岁，甲今年5×4＝20岁。"
      }
    ],
    "takeaway": "今年牛牛25岁、团团15岁。",
    "mistakes": [
      "把不同时刻的年龄直接加减或套用倍数，没有先统一时间。",
      "只让一个人长大，或把年龄和增加的总岁数误当成经过的年数。"
    ],
    "source": {
      "document": "数学原题分类汇编.docx",
      "question": "第31题",
      "paragraph": 93,
      "kind": "original"
    }
  },
  {
    "id": "agedoctorateref-1",
    "version": 1,
    "grade": 1,
    "topic": "age",
    "title": "原题32·博士与幼儿园的年龄关系",
    "description": "今年20与12，8年前12与4，8年后28与20。",
    "problem": "哥哥对弟弟说：“你长到我这么大的时候，我恰好获得博士学位；我在你这么大的时候，你刚刚上幼儿园。”已知哥哥和弟弟现在的年龄和为32岁，哥哥获得博士学位的年龄是弟弟上幼儿园年龄的7倍。求哥哥获得博士学位的年龄是多少岁。",
    "level": "原题挑战",
    "pathOrder": 132.0,
    "tags": [
      "原题挑战",
      "2026年10月原题汇编",
      "第32题"
    ],
    "scene": {
      "kind": "storyboard",
      "frames": [
        {
          "kind": "age-story",
          "names": [
            "哥哥",
            "弟弟"
          ],
          "ages": [
            20,
            12
          ],
          "time": "今年",
          "masked": true,
          "title": "三个时刻各相差一个年龄差",
          "footer": "现在哥哥与弟弟年龄和32岁。"
        },
        {
          "kind": "age-story",
          "names": [
            "哥哥",
            "弟弟"
          ],
          "ages": [
            12,
            4
          ],
          "time": "8年前：弟弟上幼儿园",
          "masked": true,
          "title": "把加减同样年数配对",
          "footer": "博士年龄＝哥哥今年加年龄差；幼儿园年龄＝弟弟今年减年龄差。"
        },
        {
          "kind": "age-story",
          "names": [
            "哥哥",
            "弟弟"
          ],
          "ages": [
            20,
            12
          ],
          "time": "两个特殊年龄的和32岁",
          "masked": true,
          "title": "先想一想",
          "footer": "博士7份、幼儿园1份，总共8份。"
        },
        {
          "kind": "age-story",
          "names": [
            "哥哥",
            "弟弟"
          ],
          "ages": [
            28,
            20
          ],
          "time": "8年后：哥哥获博士",
          "masked": false,
          "title": "求博士年龄28岁",
          "footer": "幼儿园4岁，博士28岁。"
        },
        {
          "kind": "age-story",
          "names": [
            "哥哥",
            "弟弟"
          ],
          "ages": [
            28,
            20
          ],
          "time": "8年后核对",
          "masked": false,
          "title": "还原今年的兄弟作检查",
          "footer": "今年20与12，8年前12与4，8年后28与20。"
        }
      ]
    },
    "steps": [
      {
        "title": "三个时刻各相差一个年龄差",
        "caption": "现在哥哥与弟弟年龄和32岁。",
        "narration": "哥哥弟弟今年年龄和32。弟弟长到哥哥现在年龄，需要一个年龄差；哥哥退回弟弟现在年龄，也要退一个年龄差。"
      },
      {
        "title": "把加减同样年数配对",
        "caption": "博士年龄＝哥哥今年加年龄差；幼儿园年龄＝弟弟今年减年龄差。",
        "narration": "哥哥获得博士的年龄，是哥哥今年加年龄差；弟弟上幼儿园的年龄，是弟弟今年减年龄差。一加一减，合计仍然32。"
      },
      {
        "title": "先想一想",
        "caption": "博士7份、幼儿园1份，总共8份。",
        "narration": "已知博士年龄是幼儿园年龄的7倍，两个特殊年龄的和仍然32岁。应该把32分成几份？",
        "question": {
          "prompt": "特殊年龄的和要分几份？",
          "choices": [
            "7份",
            "8份",
            "6份"
          ],
          "answer": 1,
          "explanation": "博士7份、幼儿园1份，共8份。"
        }
      },
      {
        "title": "求博士年龄28岁",
        "caption": "幼儿园4岁，博士28岁。",
        "narration": "32除以8，幼儿园年龄4岁。博士年龄是7份，4乘7等于28岁。",
        "formula": "32÷（7＋1）×7＝28（岁）"
      },
      {
        "title": "还原今年的兄弟作检查",
        "caption": "今年20与12，8年前12与4，8年后28与20。",
        "narration": "今年哥哥20，弟弟12，相差8。8年前弟弟4岁上幼儿园；8年后哥哥28岁获博士，28是4的7倍，条件都符合。",
        "formula": "20＋12＝32；28＝4×7"
      }
    ],
    "exercises": [
      {
        "id": "agedoctorateref-1-a",
        "level": "举一反三",
        "prompt": "兄弟今年年龄和36岁，哥哥获博士年龄与弟弟上幼儿园年龄和也是36岁，前者是后者8倍。哥哥获博士几岁？",
        "answer": "32",
        "unit": "岁",
        "hint": "今年20与12，8年前12与4，8年后28与20。",
        "explanation": "幼儿园年龄36÷9＝4岁，博士年龄4×8＝32岁。"
      }
    ],
    "takeaway": "今年20与12，8年前12与4，8年后28与20。",
    "mistakes": [
      "把不同时刻的年龄直接加减或套用倍数，没有先统一时间。",
      "只让一个人长大，或把年龄和增加的总岁数误当成经过的年数。"
    ],
    "source": {
      "document": "数学原题分类汇编.docx",
      "question": "第32题",
      "paragraph": 95,
      "kind": "original"
    }
  },
  {
    "id": "geometrysegmentsref-1",
    "version": 1,
    "grade": 1,
    "topic": "geometry",
    "title": "原题12（1）·拐弯图中的线段",
    "description": "只数画出的直线连接，不跨拐角。",
    "problem": "数一数，回答下面的问题。（1）第一个图中有多少条线段？",
    "level": "原题挑战",
    "pathOrder": 112.1,
    "tags": [
      "原题挑战",
      "2026年10月原题汇编",
      "第12题"
    ],
    "scene": {
      "kind": "storyboard",
      "frames": [
        {
          "kind": "source-count",
          "figure": "segments",
          "phase": "outline",
          "title": "先分清直线与折线",
          "footer": "A、B、C、D在同一直线上，D到E另起一段。"
        },
        {
          "kind": "source-count",
          "figure": "segments",
          "phase": "group",
          "group": "straight",
          "title": "按端点配对数直线段",
          "footer": "同一直线4点，线段有3加2加1条。"
        },
        {
          "kind": "source-count",
          "figure": "segments",
          "phase": "question",
          "group": "bend",
          "title": "先想一想",
          "footer": "A到E经过拐弯，不能算一条线段。"
        },
        {
          "kind": "source-count",
          "figure": "segments",
          "phase": "count",
          "title": "加上单独的一条",
          "footer": "直线部分6条，拐起部分1条，共7条。"
        },
        {
          "kind": "source-count",
          "figure": "segments",
          "phase": "check",
          "title": "逐条高亮复核",
          "footer": "只数画出的直线连接，不跨拐角。"
        }
      ]
    },
    "steps": [
      {
        "title": "先分清直线与折线",
        "caption": "A、B、C、D在同一直线上，D到E另起一段。",
        "narration": "先看原图，前4个点在同一直线上，最后一个点拐向上方。线段必须笔直，不能跨过拐弯把折线当线段。"
      },
      {
        "title": "按端点配对数直线段",
        "caption": "同一直线4点，线段有3加2加1条。",
        "narration": "从A开始，可以连后面3个点；从B开始还有2条；从C开始还有1条。3加2加1，得到6条直线段。",
        "formula": "3＋2＋1＝6（条）"
      },
      {
        "title": "先想一想",
        "caption": "A到E经过拐弯，不能算一条线段。",
        "narration": "A沿着图走到E，中间要在D拐弯。这样的折线，能算一条线段吗？先分清笔直和拐弯。",
        "question": {
          "prompt": "A到E经过拐弯，算一条线段吗？",
          "choices": [
            "算",
            "不算",
            "长度够就算"
          ],
          "answer": 1,
          "explanation": "线段必须笔直，跨越拐弯的是折线。"
        }
      },
      {
        "title": "加上单独的一条",
        "caption": "直线部分6条，拐起部分1条，共7条。",
        "narration": "右边D到E还有1条笔直的线段。6加1等于7。原图一共有7条线段。",
        "formula": "6＋1＝7（条）"
      },
      {
        "title": "逐条高亮复核",
        "caption": "只数画出的直线连接，不跨拐角。",
        "narration": "跟着金色高亮逐条核对，同一条只数一次，包含短段拼成的长线段。跨拐角的折线不算，合计7条。",
        "formula": "线段总数：7条"
      }
    ],
    "exercises": [
      {
        "id": "geometrysegmentsref-1-a",
        "level": "举一反三",
        "prompt": "同一条直线上标出4个不同的点，用这些点作端点，一共有多少条线段？",
        "answer": "6",
        "unit": "条",
        "hint": "只数画出的直线连接，不跨拐角。",
        "explanation": "每对不同端点确定一条线段，3＋2＋1＝6条。"
      }
    ],
    "takeaway": "只数画出的直线连接，不跨拐角。",
    "mistakes": [
      "只数最小图形，漏掉多个小图形组成的大图形，或重复计数同一个位置。",
      "把原图的缺线补齐，或没有核对题目要求的图形种类与标记条件。"
    ],
    "source": {
      "document": "数学原题分类汇编.docx",
      "question": "第12题（1）",
      "paragraph": 32,
      "kind": "original"
    },
    "images": [
      {
        "src": "/images/reference-20261023/033-652a76a2adbe.png",
        "alt": "原题12（1）·拐弯图中的线段原图",
        "caption": "文档原图，可点击放大；动画保留原图线段的连接和缺口。"
      }
    ]
  },
  {
    "id": "geometrystripref-1",
    "version": 1,
    "grade": 1,
    "topic": "geometry",
    "title": "原题12（2）·一行五格的长方形",
    "description": "小格和大组合都要算，不留遗漏。",
    "problem": "数一数，回答下面的问题。（2）第二个图中有多少个长方形？",
    "level": "原题挑战",
    "pathOrder": 112.2,
    "tags": [
      "原题挑战",
      "2026年10月原题汇编",
      "第12题"
    ],
    "scene": {
      "kind": "storyboard",
      "frames": [
        {
          "kind": "source-count",
          "figure": "strip",
          "phase": "outline",
          "title": "原图按一行五格计数",
          "footer": "长方形可以由连续几个小格拼成。"
        },
        {
          "kind": "source-count",
          "figure": "strip",
          "phase": "group",
          "size": 1,
          "title": "先数一格和两格",
          "footer": "宽1格有5个，宽2格有4个。"
        },
        {
          "kind": "source-count",
          "figure": "strip",
          "phase": "question",
          "size": 3,
          "title": "先想一想",
          "footer": "宽3格的框可以放3个位置。"
        },
        {
          "kind": "source-count",
          "figure": "strip",
          "phase": "count",
          "title": "继续到整行五格",
          "footer": "5加4加3加2加1＝15。"
        },
        {
          "kind": "source-count",
          "figure": "strip",
          "phase": "check",
          "title": "按大小逐个检查",
          "footer": "小格和大组合都要算，不留遗漏。"
        }
      ]
    },
    "steps": [
      {
        "title": "原图按一行五格计数",
        "caption": "长方形可以由连续几个小格拼成。",
        "narration": "原图是手绘的一行5格示意。除了5个小格，还要数相邻小格拼成的长方形。动画按同样的格线连接关系重绘。"
      },
      {
        "title": "先数一格和两格",
        "caption": "宽1格有5个，宽2格有4个。",
        "narration": "框住1格，从左到右能放5个位置。框住连续2格，只能放4个不同位置，不能把相同位置重复数。",
        "formula": "5＋4＝9"
      },
      {
        "title": "先想一想",
        "caption": "宽3格的框可以放3个位置。",
        "narration": "现在把框放宽到连续3格，沿着5格的一行移动。不同起点一共有几个呢？",
        "question": {
          "prompt": "连续3格的框有几个位置？",
          "choices": [
            "2个",
            "3个",
            "4个"
          ],
          "answer": 1,
          "explanation": "起点可在第1、2、3格，共3个。"
        }
      },
      {
        "title": "继续到整行五格",
        "caption": "5加4加3加2加1＝15。",
        "narration": "宽3格有3个，宽4格有2个，宽5格只有整行1个。把5种大小合起来，一共15个长方形。",
        "formula": "5＋4＋3＋2＋1＝15（个）"
      },
      {
        "title": "按大小逐个检查",
        "caption": "小格和大组合都要算，不留遗漏。",
        "narration": "动画从小到大逐个框选。只要左右边界不同，就是不同的长方形，重叠也可以分别算。最终15个。",
        "formula": "长方形总数：15个"
      }
    ],
    "exercises": [
      {
        "id": "geometrystripref-1-a",
        "level": "举一反三",
        "prompt": "一行4格的图，共有多少个长方形，包含正方形？",
        "answer": "10",
        "unit": "个",
        "hint": "小格和大组合都要算，不留遗漏。",
        "explanation": "4＋3＋2＋1＝10个。"
      }
    ],
    "takeaway": "小格和大组合都要算，不留遗漏。",
    "mistakes": [
      "只数最小图形，漏掉多个小图形组成的大图形，或重复计数同一个位置。",
      "把原图的缺线补齐，或没有核对题目要求的图形种类与标记条件。"
    ],
    "source": {
      "document": "数学原题分类汇编.docx",
      "question": "第12题（2）",
      "paragraph": 34,
      "kind": "original"
    },
    "images": [
      {
        "src": "/images/reference-20261023/035-f8715a8d1f52.png",
        "alt": "原题12（2）·一行五格的长方形原图",
        "caption": "文档原图，可点击放大；动画保留原图线段的连接和缺口。"
      }
    ]
  },
  {
    "id": "geometryfanref-1",
    "version": 1,
    "grade": 1,
    "topic": "geometry",
    "title": "原题12（3）·同顶点扇形三角形",
    "description": "同顶点选两条射线，不重不漏。",
    "problem": "数一数，回答下面的问题。（3）第三个图中有多少个三角形？",
    "level": "原题挑战",
    "pathOrder": 112.3,
    "tags": [
      "原题挑战",
      "2026年10月原题汇编",
      "第12题"
    ],
    "scene": {
      "kind": "storyboard",
      "frames": [
        {
          "kind": "source-count",
          "figure": "fan",
          "phase": "outline",
          "title": "找共同顶点的射线",
          "footer": "从左下角出发，共有5条线。"
        },
        {
          "kind": "source-count",
          "figure": "fan",
          "phase": "group",
          "title": "两条射线围一个三角形",
          "footer": "选两条不同射线，配上对边的一段。"
        },
        {
          "kind": "source-count",
          "figure": "fan",
          "phase": "question",
          "title": "先想一想",
          "footer": "只数4个小三角形会漏掉组合。"
        },
        {
          "kind": "source-count",
          "figure": "fan",
          "phase": "count",
          "title": "按第一条边分类",
          "footer": "4加3加2加1＝10个。"
        },
        {
          "kind": "source-count",
          "figure": "fan",
          "phase": "check",
          "title": "逐个框出不同大小",
          "footer": "同顶点选两条射线，不重不漏。"
        }
      ]
    },
    "steps": [
      {
        "title": "找共同顶点的射线",
        "caption": "从左下角出发，共有5条线。",
        "narration": "原图所有分割线都从左下角出发。连同两条外边，一共有5条射线，另一侧把它们连起来。"
      },
      {
        "title": "两条射线围一个三角形",
        "caption": "选两条不同射线，配上对边的一段。",
        "narration": "每选两条射线，都能与对边之间的一段组成三角形。从最左一条开始，可与另外4条分别配对。"
      },
      {
        "title": "先想一想",
        "caption": "只数4个小三角形会漏掉组合。",
        "narration": "图上最小三角形有4个。如果只数它们，会不会漏掉两块、三块拼成的大三角形？",
        "question": {
          "prompt": "只数4个最小三角形够吗？",
          "choices": [
            "够",
            "不够",
            "大三角形不算"
          ],
          "answer": 1,
          "explanation": "还要数多个小三角形拼成的组合。"
        }
      },
      {
        "title": "按第一条边分类",
        "caption": "4加3加2加1＝10个。",
        "narration": "第一条射线有4种搭配，第二条还剩3种，接着2种、1种。4加3加2加1，一共有10个三角形。",
        "formula": "4＋3＋2＋1＝10（个）"
      },
      {
        "title": "逐个框出不同大小",
        "caption": "同顶点选两条射线，不重不漏。",
        "narration": "看动画逐个高亮，最小的4个之外，还有拼成的大三角形。固定第一条射线，再向后搭配，就不会重复。",
        "formula": "三角形总数：10个"
      }
    ],
    "exercises": [
      {
        "id": "geometryfanref-1-a",
        "level": "举一反三",
        "prompt": "同一顶点引出4条射线，都与同一条对边相交，可以组成几个三角形？",
        "answer": "6",
        "unit": "个",
        "hint": "同顶点选两条射线，不重不漏。",
        "explanation": "3＋2＋1＝6个。"
      }
    ],
    "takeaway": "同顶点选两条射线，不重不漏。",
    "mistakes": [
      "只数最小图形，漏掉多个小图形组成的大图形，或重复计数同一个位置。",
      "把原图的缺线补齐，或没有核对题目要求的图形种类与标记条件。"
    ],
    "source": {
      "document": "数学原题分类汇编.docx",
      "question": "第12题（3）",
      "paragraph": 36,
      "kind": "original"
    },
    "images": [
      {
        "src": "/images/reference-20261023/037-6ba5a8073536.png",
        "alt": "原题12（3）·同顶点扇形三角形原图",
        "caption": "文档原图，可点击放大；动画保留原图线段的连接和缺口。"
      }
    ]
  },
  {
    "id": "geometrymissingrectref-1",
    "version": 1,
    "grade": 1,
    "topic": "geometry",
    "title": "原题13·短竖线参与的长方形",
    "description": "四条边都完整画出，才计入。",
    "problem": "数一数，图中有多少个长方形（包含正方形）？",
    "level": "原题挑战",
    "pathOrder": 113.0,
    "tags": [
      "原题挑战",
      "2026年10月原题汇编",
      "第13题"
    ],
    "scene": {
      "kind": "storyboard",
      "frames": [
        {
          "kind": "source-count",
          "figure": "missingRect",
          "phase": "outline",
          "title": "先辨认哪条线没有到底",
          "footer": "5条完整竖线，另有1条只在顶层。"
        },
        {
          "kind": "source-count",
          "figure": "missingRect",
          "phase": "group",
          "group": "complete",
          "title": "先数完整竖线的组合",
          "footer": "完整竖线选两条有10种，横线选两条有6种。"
        },
        {
          "kind": "source-count",
          "figure": "missingRect",
          "phase": "question",
          "group": "short",
          "title": "先想一想",
          "footer": "短竖线只能围成顶层的框。"
        },
        {
          "kind": "source-count",
          "figure": "missingRect",
          "phase": "count",
          "group": "short",
          "title": "再加入顶层新增的5个",
          "footer": "短竖线与5条完整竖线分别配对。"
        },
        {
          "kind": "source-count",
          "figure": "missingRect",
          "phase": "check",
          "title": "沿真实边界逐个检查",
          "footer": "四条边都完整画出，才计入。"
        }
      ]
    },
    "steps": [
      {
        "title": "先辨认哪条线没有到底",
        "caption": "5条完整竖线，另有1条只在顶层。",
        "narration": "仔细看原图，中间偏左的一条竖线只画在最上面一层，没有一直画到底。动画保留这处缺线，不能擅自补齐。"
      },
      {
        "title": "先数完整竖线的组合",
        "caption": "完整竖线选两条有10种，横线选两条有6种。",
        "narration": "先不用短竖线。5条完整竖线选两条，有10种；4条横线选两条，有6种。10乘6，先得到60个。",
        "formula": "10×6＝60（个）"
      },
      {
        "title": "先想一想",
        "caption": "短竖线只能围成顶层的框。",
        "narration": "短竖线没有延伸到下面。它能参与跨越下面几层的大长方形吗？还是只能在最上面一层使用？",
        "question": {
          "prompt": "短竖线可以用于哪一层？",
          "choices": [
            "任意层",
            "最上面一层",
            "最下面一层"
          ],
          "answer": 1,
          "explanation": "短线仅在顶层，下面没有画出。"
        }
      },
      {
        "title": "再加入顶层新增的5个",
        "caption": "短竖线与5条完整竖线分别配对。",
        "narration": "短竖线只能选顶层两条横边，另一条竖边可以选5条完整竖线中的任意一条，所以新增5个。60加5，等于65。",
        "formula": "60＋5＝65（个）"
      },
      {
        "title": "沿真实边界逐个检查",
        "caption": "四条边都完整画出，才计入。",
        "narration": "动画逐个框选65个长方形。每次检查四条边是否存在，不能让框跨过缺失竖线，却把不存在的边算进去。",
        "formula": "长方形总数：65个"
      }
    ],
    "exercises": [
      {
        "id": "geometrymissingrectref-1-a",
        "level": "举一反三",
        "prompt": "原图中那条短竖线能新增多少个长方形？",
        "answer": "5",
        "unit": "个",
        "hint": "四条边都完整画出，才计入。",
        "explanation": "短竖线与5条完整竖线分别配对，横边只能取顶层上下两条，共5个。"
      }
    ],
    "takeaway": "四条边都完整画出，才计入。",
    "mistakes": [
      "只数最小图形，漏掉多个小图形组成的大图形，或重复计数同一个位置。",
      "把原图的缺线补齐，或没有核对题目要求的图形种类与标记条件。"
    ],
    "source": {
      "document": "数学原题分类汇编.docx",
      "question": "第13题",
      "paragraph": 39,
      "kind": "original"
    },
    "images": [
      {
        "src": "/images/reference-20261023/040-83084c1db175.png",
        "alt": "原题13·短竖线参与的长方形原图",
        "caption": "文档原图，可点击放大；动画保留原图线段的连接和缺口。"
      }
    ]
  },
  {
    "id": "geometrymissingsquareref-1",
    "version": 1,
    "grade": 1,
    "topic": "geometry",
    "title": "原题14·有缺线的四乘四正方形",
    "description": "正方形还要求边长相同。",
    "problem": "数一数，图中有多少个正方形？",
    "level": "原题挑战",
    "pathOrder": 114.0,
    "tags": [
      "原题挑战",
      "2026年10月原题汇编",
      "第14题"
    ],
    "scene": {
      "kind": "storyboard",
      "frames": [
        {
          "kind": "source-count",
          "figure": "missingSquare",
          "phase": "outline",
          "title": "正方形四边必须完整",
          "footer": "原图有些内部横线只在左右两边。"
        },
        {
          "kind": "source-count",
          "figure": "missingSquare",
          "phase": "group",
          "size": 1,
          "title": "按边长一格分类",
          "footer": "边长1格，左右各4个，共8个。"
        },
        {
          "kind": "source-count",
          "figure": "missingSquare",
          "phase": "question",
          "size": 2,
          "title": "先想一想",
          "footer": "缺失横线处不能组成小正方形。"
        },
        {
          "kind": "source-count",
          "figure": "missingSquare",
          "phase": "count",
          "title": "再数边长二格与四格",
          "footer": "2格有6个，3格0个，4格1个，共15。"
        },
        {
          "kind": "source-count",
          "figure": "missingSquare",
          "phase": "check",
          "title": "逐框检查四边",
          "footer": "正方形还要求边长相同。"
        }
      ]
    },
    "steps": [
      {
        "title": "正方形四边必须完整",
        "caption": "原图有些内部横线只在左右两边。",
        "narration": "原图按4乘4方格的位置排列，但中间两列有缺失横线。数正方形时，必须确认四条边都画出来，不能只看格子大小。"
      },
      {
        "title": "按边长一格分类",
        "caption": "边长1格，左右各4个，共8个。",
        "narration": "先数最小的，只有最左列和最右列的4个小格边界完整，所以一格正方形共8个。",
        "formula": "4＋4＝8（个）"
      },
      {
        "title": "先想一想",
        "caption": "缺失横线处不能组成小正方形。",
        "narration": "中间列看起来能分成小格，但部分横线没有画出。这些缺了边的小格，能当正方形计数吗？",
        "question": {
          "prompt": "缺了边的小格能数吗？",
          "choices": [
            "能",
            "不能",
            "只要位置对就能"
          ],
          "answer": 1,
          "explanation": "组成正方形的四条边都必须在图上。"
        }
      },
      {
        "title": "再数边长二格与四格",
        "caption": "2格有6个，3格0个，4格1个，共15。",
        "narration": "边长2格的，上下各能放3个，共6个。边长3格都会碰到缺边，没有；整幅4格的大正方形1个。8加6加1，一共15个。",
        "formula": "8＋6＋0＋1＝15（个）"
      },
      {
        "title": "逐框检查四边",
        "caption": "正方形还要求边长相同。",
        "narration": "跟着高亮，检查15个正方形的四条边。既要边完整，也要长宽相同；长方形不能混进来。",
        "formula": "正方形总数：15个"
      }
    ],
    "exercises": [
      {
        "id": "geometrymissingsquareref-1-a",
        "level": "举一反三",
        "prompt": "原图中边长2格的正方形共有几个？",
        "answer": "6",
        "unit": "个",
        "hint": "正方形还要求边长相同。",
        "explanation": "上半部分3个、下半部分3个，共6个。"
      }
    ],
    "takeaway": "正方形还要求边长相同。",
    "mistakes": [
      "只数最小图形，漏掉多个小图形组成的大图形，或重复计数同一个位置。",
      "把原图的缺线补齐，或没有核对题目要求的图形种类与标记条件。"
    ],
    "source": {
      "document": "数学原题分类汇编.docx",
      "question": "第14题",
      "paragraph": 44,
      "kind": "original"
    },
    "images": [
      {
        "src": "/images/reference-20261023/045-282173502ba9.png",
        "alt": "原题14·有缺线的四乘四正方形原图",
        "caption": "文档原图，可点击放大；动画保留原图线段的连接和缺口。"
      }
    ]
  },
  {
    "id": "geometrylayeredtriangleref-1",
    "version": 1,
    "grade": 1,
    "topic": "geometry",
    "title": "原题15·三层同顶点三角形",
    "description": "只用图上实际画出的边。",
    "problem": "数一数，图中有多少个三角形？",
    "level": "原题挑战",
    "pathOrder": 115.0,
    "tags": [
      "原题挑战",
      "2026年10月原题汇编",
      "第15题"
    ],
    "scene": {
      "kind": "storyboard",
      "frames": [
        {
          "kind": "source-count",
          "figure": "layeredTriangle",
          "phase": "outline",
          "title": "射线与底边层数分开看",
          "footer": "5条射线，3条不同高度的底边。"
        },
        {
          "kind": "source-count",
          "figure": "layeredTriangle",
          "phase": "group",
          "group": "1",
          "title": "先固定最上层底边",
          "footer": "每层选两条射线，有10个三角形。"
        },
        {
          "kind": "source-count",
          "figure": "layeredTriangle",
          "phase": "question",
          "group": "2",
          "title": "先想一想",
          "footer": "换底边高度，就得到另一组图形。"
        },
        {
          "kind": "source-count",
          "figure": "layeredTriangle",
          "phase": "count",
          "title": "把三层合起来",
          "footer": "每层10个，三层共30个。"
        },
        {
          "kind": "source-count",
          "figure": "layeredTriangle",
          "phase": "check",
          "title": "按底边层逐组复核",
          "footer": "只用图上实际画出的边。"
        }
      ]
    },
    "steps": [
      {
        "title": "射线与底边层数分开看",
        "caption": "5条射线，3条不同高度的底边。",
        "narration": "从顶点往下看，连同外边共有5条射线；横向有3层可作底边。每一层，都能数同一顶点出发的三角形。"
      },
      {
        "title": "先固定最上层底边",
        "caption": "每层选两条射线，有10个三角形。",
        "narration": "先只看最上层底边。两条射线配成一个三角形，4加3加2加1，这一层一共10个。",
        "formula": "4＋3＋2＋1＝10"
      },
      {
        "title": "先想一想",
        "caption": "换底边高度，就得到另一组图形。",
        "narration": "射线不变，但把底边换到中间层或最下层，三角形大小改变了。这些能分别计数吗？",
        "question": {
          "prompt": "不同高度底边得到的三角形分别算吗？",
          "choices": [
            "分别算",
            "只算最大的",
            "只算最小的"
          ],
          "answer": 0,
          "explanation": "底边高度不同，图形大小也不同。"
        }
      },
      {
        "title": "把三层合起来",
        "caption": "每层10个，三层共30个。",
        "narration": "三条底边高度不同，得到的三角形也不同。每层10个，10乘3，一共30个三角形。",
        "formula": "10×3＝30（个）"
      },
      {
        "title": "按底边层逐组复核",
        "caption": "只用图上实际画出的边。",
        "narration": "看动画逐组高亮，上层10个、中层10个、下层10个。没有倒立三角形，因为斜线都在同一顶点相交。",
        "formula": "三角形总数：30个"
      }
    ],
    "exercises": [
      {
        "id": "geometrylayeredtriangleref-1-a",
        "level": "举一反三",
        "prompt": "同样5条射线，如果只有2层底边，共能组成几个三角形？",
        "answer": "20",
        "unit": "个",
        "hint": "只用图上实际画出的边。",
        "explanation": "每层10个，两层10×2＝20个。"
      }
    ],
    "takeaway": "只用图上实际画出的边。",
    "mistakes": [
      "只数最小图形，漏掉多个小图形组成的大图形，或重复计数同一个位置。",
      "把原图的缺线补齐，或没有核对题目要求的图形种类与标记条件。"
    ],
    "source": {
      "document": "数学原题分类汇编.docx",
      "question": "第15题",
      "paragraph": 47,
      "kind": "original"
    },
    "images": [
      {
        "src": "/images/reference-20261023/048-d008842903f5.png",
        "alt": "原题15·三层同顶点三角形原图",
        "caption": "文档原图，可点击放大；动画保留原图线段的连接和缺口。"
      }
    ]
  },
  {
    "id": "geometryanimalsref-1",
    "version": 1,
    "grade": 1,
    "topic": "geometry",
    "title": "原题16·恰好一个马和一个牛",
    "description": "每个金色框内都恰好一马一牛。",
    "problem": "在下图中，同时包含一个“马”字和一个“牛”字（同时包含两个“马”字的不算）的长方形有多少个？",
    "level": "原题挑战",
    "pathOrder": 116.0,
    "tags": [
      "原题挑战",
      "2026年10月原题汇编",
      "第16题"
    ],
    "scene": {
      "kind": "storyboard",
      "frames": [
        {
          "kind": "source-count",
          "figure": "animals",
          "phase": "outline",
          "title": "把限制词圈出来",
          "footer": "必须含牛和恰好1个马，两个马同时在内的不算。"
        },
        {
          "kind": "source-count",
          "figure": "animals",
          "phase": "group",
          "group": "left",
          "title": "先选左下方的马",
          "footer": "含左下马与牛、排除右上马，共14个。"
        },
        {
          "kind": "source-count",
          "figure": "animals",
          "phase": "question",
          "group": "right",
          "title": "先想一想",
          "footer": "两个马都在框里，不符合原题。"
        },
        {
          "kind": "source-count",
          "figure": "animals",
          "phase": "count",
          "title": "再选右上方的马",
          "footer": "另一类同样14个，总共28个。"
        },
        {
          "kind": "source-count",
          "figure": "animals",
          "phase": "check",
          "title": "按选中的马逐组检查",
          "footer": "每个金色框内都恰好一马一牛。"
        }
      ]
    },
    "steps": [
      {
        "title": "把限制词圈出来",
        "caption": "必须含牛和恰好1个马，两个马同时在内的不算。",
        "narration": "原图有两个马、一个牛。长方形要含牛，还必须恰好包含一个马，同时包含两个马的框，要排除。"
      },
      {
        "title": "先选左下方的马",
        "caption": "含左下马与牛、排除右上马，共14个。",
        "narration": "先选左下方的马，和中间的牛一起框住。这类原有18种边界搭配，其中4个也含右上马，排除后剩14个。",
        "formula": "18－4＝14（个）"
      },
      {
        "title": "先想一想",
        "caption": "两个马都在框里，不符合原题。",
        "narration": "如果一个框同时包含牛和两个马，虽然也有马和牛，它符不符合原题的限制？",
        "question": {
          "prompt": "同时含两个马和一个牛的框算吗？",
          "choices": [
            "算",
            "不算",
            "看大小决定"
          ],
          "answer": 1,
          "explanation": "原题明确两个马同时包含的不算。"
        }
      },
      {
        "title": "再选右上方的马",
        "caption": "另一类同样14个，总共28个。",
        "narration": "再选右上方的马与牛，同时排除左下马，也有14个。这两组不会重叠，14加14，答案28个。",
        "formula": "（18－4）×2＝28（个）"
      },
      {
        "title": "按选中的马逐组检查",
        "caption": "每个金色框内都恰好一马一牛。",
        "narration": "跟着高亮逐个看，框内都有牛，而且恰好一个马。两个马同时出现的4个框已经排除，最后28个。",
        "formula": "符合条件的长方形：28个"
      }
    ],
    "exercises": [
      {
        "id": "geometryanimalsref-1-a",
        "level": "举一反三",
        "prompt": "一个框同时包含两个“马”和一个“牛”，符合原题的计数条件吗？请填“算”或“不算”。",
        "answer": "不算",
        "unit": "",
        "hint": "每个金色框内都恰好一马一牛。",
        "explanation": "两个马同时包含的长方形要排除。",
        "choices": [
          "算",
          "不算"
        ],
        "choiceSuffix": ""
      }
    ],
    "takeaway": "每个金色框内都恰好一马一牛。",
    "mistakes": [
      "只数最小图形，漏掉多个小图形组成的大图形，或重复计数同一个位置。",
      "把原图的缺线补齐，或没有核对题目要求的图形种类与标记条件。"
    ],
    "source": {
      "document": "数学原题分类汇编.docx",
      "question": "第16题",
      "paragraph": 50,
      "kind": "original"
    },
    "images": [
      {
        "src": "/images/reference-20261023/051-3a621ae84111.png",
        "alt": "原题16·恰好一个马和一个牛原图",
        "caption": "文档原图，可点击放大；动画保留原图线段的连接和缺口。"
      }
    ]
  },
  {
    "id": "geometrynestedrectref-1",
    "version": 1,
    "grade": 1,
    "topic": "geometry",
    "title": "原题17·内外长方形交叉计数",
    "description": "只要四边完整，组合框也算。",
    "problem": "数一数图中共有多少个长方形（包括正方形）？",
    "level": "原题挑战",
    "pathOrder": 117.0,
    "tags": [
      "原题挑战",
      "2026年10月原题汇编",
      "第17题"
    ],
    "scene": {
      "kind": "storyboard",
      "frames": [
        {
          "kind": "source-count",
          "figure": "nestedRect",
          "phase": "outline",
          "title": "先分内外框的线",
          "footer": "外框3列2行，内框也被分成3列2行。"
        },
        {
          "kind": "source-count",
          "figure": "nestedRect",
          "phase": "group",
          "group": "outer",
          "title": "先数外层和内层",
          "footer": "外层18个，内层18个。"
        },
        {
          "kind": "source-count",
          "figure": "nestedRect",
          "phase": "question",
          "group": "inner",
          "title": "先想一想",
          "footer": "还要检查内外横边混合使用的框。"
        },
        {
          "kind": "source-count",
          "figure": "nestedRect",
          "phase": "count",
          "group": "bridge",
          "title": "加入四个内外拼接框",
          "footer": "18加18加4＝40。"
        },
        {
          "kind": "source-count",
          "figure": "nestedRect",
          "phase": "check",
          "title": "按真实线段复核",
          "footer": "只要四边完整，组合框也算。"
        }
      ]
    },
    "steps": [
      {
        "title": "先分内外框的线",
        "caption": "外框3列2行，内框也被分成3列2行。",
        "narration": "原图有一个外框，内部还有一个长方形，与中间横线和两条竖线相交。先按使用的横边分类，避免漏数内外拼接的框。"
      },
      {
        "title": "先数外层和内层",
        "caption": "外层18个，内层18个。",
        "narration": "只用外层3条横线和4条完整竖线，能组成18个；只用内框的3条横线和4条内部竖线，也有18个。",
        "formula": "6×3＝18"
      },
      {
        "title": "先想一想",
        "caption": "还要检查内外横边混合使用的框。",
        "narration": "外层18、内层18，是不是已经全部数完？还有一些框，一条横边来自外层，另一条来自内层，也不能漏掉。",
        "question": {
          "prompt": "内外横边混合组成的框要算吗？",
          "choices": [
            "要算",
            "不算",
            "只有正方形才算"
          ],
          "answer": 0,
          "explanation": "只要四边都实际存在，就要计数。"
        }
      },
      {
        "title": "加入四个内外拼接框",
        "caption": "18加18加4＝40。",
        "narration": "在中间两条完整竖线之间，外横边与内横边可以混合配出4个额外框。18加18加4，一共40个。",
        "formula": "18＋18＋4＝40（个）"
      },
      {
        "title": "按真实线段复核",
        "caption": "只要四边完整，组合框也算。",
        "narration": "动画依次框出40个长方形。内外两类加拼接类，分类没有重复；每条边都来自原图画出的线段。",
        "formula": "长方形总数：40个"
      }
    ],
    "exercises": [
      {
        "id": "geometrynestedrectref-1-a",
        "level": "举一反三",
        "prompt": "完整的3列2行方格图，共有多少个长方形，包含正方形？",
        "answer": "18",
        "unit": "个",
        "hint": "只要四边完整，组合框也算。",
        "explanation": "竖线4条选2有6种，横线3条选2有3种，6×3＝18个。"
      }
    ],
    "takeaway": "只要四边完整，组合框也算。",
    "mistakes": [
      "只数最小图形，漏掉多个小图形组成的大图形，或重复计数同一个位置。",
      "把原图的缺线补齐，或没有核对题目要求的图形种类与标记条件。"
    ],
    "source": {
      "document": "数学原题分类汇编.docx",
      "question": "第17题",
      "paragraph": 55,
      "kind": "original"
    },
    "images": [
      {
        "src": "/images/reference-20261023/056-24491fcd3a9a.png",
        "alt": "原题17·内外长方形交叉计数原图",
        "caption": "文档原图，可点击放大；动画保留原图线段的连接和缺口。"
      }
    ]
  },
  {
    "id": "geometrysplittriangleref-1",
    "version": 1,
    "grade": 1,
    "topic": "geometry",
    "title": "原题18·扇形外再添短竖线",
    "description": "新分割不会删去原来的大三角形。",
    "problem": "数一数，图中有多少个三角形？",
    "level": "原题挑战",
    "pathOrder": 118.0,
    "tags": [
      "原题挑战",
      "2026年10月原题汇编",
      "第18题"
    ],
    "scene": {
      "kind": "storyboard",
      "frames": [
        {
          "kind": "source-count",
          "figure": "splitTriangle",
          "phase": "outline",
          "title": "保留左侧短竖线",
          "footer": "扇形结构之外，左边还有一条短竖线。"
        },
        {
          "kind": "source-count",
          "figure": "splitTriangle",
          "phase": "group",
          "group": "core",
          "title": "先不使用短竖线",
          "footer": "左边6个、右边6个、整幅1个，共13个。"
        },
        {
          "kind": "source-count",
          "figure": "splitTriangle",
          "phase": "question",
          "group": "extra",
          "title": "先想一想",
          "footer": "短竖线把左侧一块分成两个。"
        },
        {
          "kind": "source-count",
          "figure": "splitTriangle",
          "phase": "count",
          "group": "extra",
          "title": "补上两个新增三角形",
          "footer": "13加2＝15。"
        },
        {
          "kind": "source-count",
          "figure": "splitTriangle",
          "phase": "check",
          "title": "大组合与小图形都核对",
          "footer": "新分割不会删去原来的大三角形。"
        }
      ]
    },
    "steps": [
      {
        "title": "保留左侧短竖线",
        "caption": "扇形结构之外，左边还有一条短竖线。",
        "narration": "先看原图，不光有从底部公共点展开的线，左下角还有一条短竖线。不能只套扇形公式漏掉新增图形。"
      },
      {
        "title": "先不使用短竖线",
        "caption": "左边6个、右边6个、整幅1个，共13个。",
        "narration": "先忽略左下短竖线。公共点左侧有6个三角形，右侧也有6个，再加整个外边界的大三角形，共13个。",
        "formula": "6＋6＋1＝13（个）"
      },
      {
        "title": "先想一想",
        "caption": "短竖线把左侧一块分成两个。",
        "narration": "现在把短竖线加回来。它和斜边、底边能组成两个新的小三角形，这两个应该再加进去吗？",
        "question": {
          "prompt": "短竖线新增的两个小三角形要加吗？",
          "choices": [
            "不加",
            "要加",
            "只留小的删掉大的"
          ],
          "answer": 1,
          "explanation": "新增小图形与原有大图形都要计入。"
        }
      },
      {
        "title": "补上两个新增三角形",
        "caption": "13加2＝15。",
        "narration": "短竖线两侧各新增1个三角形，一共新增2个。原来的13个仍然存在，所以13加2，等于15。",
        "formula": "13＋2＝15（个）"
      },
      {
        "title": "大组合与小图形都核对",
        "caption": "新分割不会删去原来的大三角形。",
        "narration": "看高亮，左侧新增两个要数，原来由它们拼成的大三角形也要数。分割以后，大组合仍在，总数15。",
        "formula": "三角形总数：15个"
      }
    ],
    "exercises": [
      {
        "id": "geometrysplittriangleref-1-a",
        "level": "举一反三",
        "prompt": "原来有13个三角形，加一条短线后新增2个，原来的仍完整，共有几个？",
        "answer": "15",
        "unit": "个",
        "hint": "新分割不会删去原来的大三角形。",
        "explanation": "13＋2＝15个；分割不删除原有大组合。"
      }
    ],
    "takeaway": "新分割不会删去原来的大三角形。",
    "mistakes": [
      "只数最小图形，漏掉多个小图形组成的大图形，或重复计数同一个位置。",
      "把原图的缺线补齐，或没有核对题目要求的图形种类与标记条件。"
    ],
    "source": {
      "document": "数学原题分类汇编.docx",
      "question": "第18题",
      "paragraph": 58,
      "kind": "original"
    },
    "images": [
      {
        "src": "/images/reference-20261023/059-e09a69e2e346.png",
        "alt": "原题18·扇形外再添短竖线原图",
        "caption": "文档原图，可点击放大；动画保留原图线段的连接和缺口。"
      }
    ]
  },
  {
    "id": "geometrystarref-1",
    "version": 1,
    "grade": 1,
    "topic": "geometry",
    "title": "原题19·包含星星的正方形",
    "description": "缺角、正方形、含星三个条件都满足。",
    "problem": "数一数，下图中共有多少个包含★的正方形？",
    "level": "原题挑战",
    "pathOrder": 119.0,
    "tags": [
      "原题挑战",
      "2026年10月原题汇编",
      "第19题"
    ],
    "scene": {
      "kind": "storyboard",
      "frames": [
        {
          "kind": "source-count",
          "figure": "star",
          "phase": "outline",
          "title": "只数包含星星的正方形",
          "footer": "左上与右下有缺角，星星在第4列第2行。"
        },
        {
          "kind": "source-count",
          "figure": "star",
          "phase": "group",
          "size": 2,
          "title": "边长一格与两格",
          "footer": "边长1格有1个，2格有4个。"
        },
        {
          "kind": "source-count",
          "figure": "star",
          "phase": "question",
          "size": 3,
          "title": "先想一想",
          "footer": "碰到缺角而缺边的框不能算。"
        },
        {
          "kind": "source-count",
          "figure": "star",
          "phase": "count",
          "title": "继续边长三格与四格",
          "footer": "3格有5个，4格1个，共11个。"
        },
        {
          "kind": "source-count",
          "figure": "star",
          "phase": "check",
          "title": "逐个检查星星位置",
          "footer": "缺角、正方形、含星三个条件都满足。"
        }
      ]
    },
    "steps": [
      {
        "title": "只数包含星星的正方形",
        "caption": "左上与右下有缺角，星星在第4列第2行。",
        "narration": "原图有缺角，题目还要求包含星星。每个候选框都要检查三件事，四边存在、长宽相同、星星在框内。"
      },
      {
        "title": "边长一格与两格",
        "caption": "边长1格有1个，2格有4个。",
        "narration": "边长1格，只有星星所在的那一格。边长2格，可以向不同方向平移，包含星星的完整位置共4个。",
        "formula": "1＋4＝5（个）"
      },
      {
        "title": "先想一想",
        "caption": "碰到缺角而缺边的框不能算。",
        "narration": "把框放大后，如果一条边经过左上或右下的缺角，即使包含星星，也能算完整正方形吗？",
        "question": {
          "prompt": "含星但缺一条边的框算吗？",
          "choices": [
            "算",
            "不算",
            "只要够大就算"
          ],
          "answer": 1,
          "explanation": "必须四边完整，缺角处不能补线。"
        }
      },
      {
        "title": "继续边长三格与四格",
        "caption": "3格有5个，4格1个，共11个。",
        "narration": "边长3格，包含星星且四边完整的有5个；边长4格只有1个。合计1加4加5加1，等于11。",
        "formula": "1＋4＋5＋1＝11（个）"
      },
      {
        "title": "逐个检查星星位置",
        "caption": "缺角、正方形、含星三个条件都满足。",
        "narration": "动画按大小逐个框出11个位置。每次看星星是否在里面，也看缺角处有没有缺边，三个条件都满足才算。",
        "formula": "包含星星的正方形：11个"
      }
    ],
    "exercises": [
      {
        "id": "geometrystarref-1-a",
        "level": "举一反三",
        "prompt": "原图中包含星星、边长2格的正方形有几个？",
        "answer": "4",
        "unit": "个",
        "hint": "缺角、正方形、含星三个条件都满足。",
        "explanation": "星星可以位于2×2方框的四个小格位置，各有一个完整正方形，共4个。"
      }
    ],
    "takeaway": "缺角、正方形、含星三个条件都满足。",
    "mistakes": [
      "只数最小图形，漏掉多个小图形组成的大图形，或重复计数同一个位置。",
      "把原图的缺线补齐，或没有核对题目要求的图形种类与标记条件。"
    ],
    "source": {
      "document": "数学原题分类汇编.docx",
      "question": "第19题",
      "paragraph": 61,
      "kind": "original"
    },
    "images": [
      {
        "src": "/images/reference-20261023/062-11c09c71cad3.png",
        "alt": "原题19·包含星星的正方形原图",
        "caption": "文档原图，可点击放大；动画保留原图线段的连接和缺口。"
      }
    ]
  },
  {
    "id": "geometrybrokensquareref-1",
    "version": 1,
    "grade": 1,
    "topic": "geometry",
    "title": "原题20·缺两段竖线的正方形",
    "description": "缺线影响边界，不只影响最小格。",
    "problem": "数一数，下图中共有多少个正方形？",
    "level": "原题挑战",
    "pathOrder": 120.0,
    "tags": [
      "原题挑战",
      "2026年10月原题汇编",
      "第20题"
    ],
    "scene": {
      "kind": "storyboard",
      "frames": [
        {
          "kind": "source-count",
          "figure": "brokenSquare",
          "phase": "outline",
          "title": "把缺线位置先标出来",
          "footer": "上排左侧一段竖线、下排右侧一段竖线未画。"
        },
        {
          "kind": "source-count",
          "figure": "brokenSquare",
          "phase": "group",
          "size": 1,
          "title": "先数一格和两格",
          "footer": "边长1格12个，2格7个。"
        },
        {
          "kind": "source-count",
          "figure": "brokenSquare",
          "phase": "question",
          "size": 2,
          "title": "先想一想",
          "footer": "一条缺线会影响两侧的小格。"
        },
        {
          "kind": "source-count",
          "figure": "brokenSquare",
          "phase": "count",
          "title": "再数三格和四格",
          "footer": "3格2个，4格1个，合计22。"
        },
        {
          "kind": "source-count",
          "figure": "brokenSquare",
          "phase": "check",
          "title": "用真实边界逐个确认",
          "footer": "缺线影响边界，不只影响最小格。"
        }
      ]
    },
    "steps": [
      {
        "title": "把缺线位置先标出来",
        "caption": "上排左侧一段竖线、下排右侧一段竖线未画。",
        "narration": "原图的横线完整，但上排一段竖线和下排另一段竖线缺失。数正方形时，不能当成完整4乘4网格。"
      },
      {
        "title": "先数一格和两格",
        "caption": "边长1格12个，2格7个。",
        "narration": "完整4乘4网格原有16个小正方形，缺线影响4个，剩12个。边长2格逐个平移检查，符合的有7个。",
        "formula": "12＋7＝19（个）"
      },
      {
        "title": "先想一想",
        "caption": "一条缺线会影响两侧的小格。",
        "narration": "最上排的一段内部竖线缺失，它左右两个小格都会缺边。是不是只能扣掉1个小正方形呢？",
        "question": {
          "prompt": "一段内部竖线缺失会影响几个相邻小格？",
          "choices": [
            "1个",
            "2个",
            "0个"
          ],
          "answer": 1,
          "explanation": "这段线同时是左右两个小格的边。"
        }
      },
      {
        "title": "再数三格和四格",
        "caption": "3格2个，4格1个，合计22。",
        "narration": "边长3格，4个位置中只有2个四边完整；边长4格外框1个。12加7加2加1，总共22个正方形。",
        "formula": "12＋7＋2＋1＝22（个）"
      },
      {
        "title": "用真实边界逐个确认",
        "caption": "缺线影响边界，不只影响最小格。",
        "narration": "跟着高亮看，一格、两格、三格、四格分别检查。每个候选框的四条边都必须存在，最终22个。",
        "formula": "正方形总数：22个"
      }
    ],
    "exercises": [
      {
        "id": "geometrybrokensquareref-1-a",
        "level": "举一反三",
        "prompt": "原图边长3格的正方形共有几个？",
        "answer": "2",
        "unit": "个",
        "hint": "缺线影响边界，不只影响最小格。",
        "explanation": "四个可能的位置中，两个因缺少边界被排除，剩2个。"
      }
    ],
    "takeaway": "缺线影响边界，不只影响最小格。",
    "mistakes": [
      "只数最小图形，漏掉多个小图形组成的大图形，或重复计数同一个位置。",
      "把原图的缺线补齐，或没有核对题目要求的图形种类与标记条件。"
    ],
    "source": {
      "document": "数学原题分类汇编.docx",
      "question": "第20题",
      "paragraph": 66,
      "kind": "original"
    },
    "images": [
      {
        "src": "/images/reference-20261023/067-b7d6c8b96707.png",
        "alt": "原题20·缺两段竖线的正方形原图",
        "caption": "文档原图，可点击放大；动画保留原图线段的连接和缺口。"
      }
    ]
  },
  {
    "id": "geometrypartialrectref-1",
    "version": 1,
    "grade": 1,
    "topic": "geometry",
    "title": "原题21·下方新增竖线的长方形",
    "description": "60个完整线框，加15个短线框。",
    "problem": "数一数，下图中共有多少个长方形？",
    "level": "原题挑战",
    "pathOrder": 121.0,
    "tags": [
      "原题挑战",
      "2026年10月原题汇编",
      "第21题"
    ],
    "scene": {
      "kind": "storyboard",
      "frames": [
        {
          "kind": "source-count",
          "figure": "partialRect",
          "phase": "outline",
          "title": "完整竖线与短竖线分开",
          "footer": "5条完整竖线，另有1条仅贯穿下面两层。"
        },
        {
          "kind": "source-count",
          "figure": "partialRect",
          "phase": "group",
          "group": "complete",
          "title": "先数完整线的组合",
          "footer": "完整竖线10种，横线6种，先有60个。"
        },
        {
          "kind": "source-count",
          "figure": "partialRect",
          "phase": "question",
          "group": "short",
          "title": "先想一想",
          "footer": "短线可使用的横线只有下面3条。"
        },
        {
          "kind": "source-count",
          "figure": "partialRect",
          "phase": "count",
          "group": "short",
          "title": "加入短线带来的15个",
          "footer": "短线配5条完整线，横边有3种，共15。"
        },
        {
          "kind": "source-count",
          "figure": "partialRect",
          "phase": "check",
          "title": "检查短线不越过起点",
          "footer": "60个完整线框，加15个短线框。"
        }
      ]
    },
    "steps": [
      {
        "title": "完整竖线与短竖线分开",
        "caption": "5条完整竖线，另有1条仅贯穿下面两层。",
        "narration": "原图共有4条横线。5条竖线贯穿全高，另外1条从第二条横线才开始，只穿过下面两层。"
      },
      {
        "title": "先数完整线的组合",
        "caption": "完整竖线10种，横线6种，先有60个。",
        "narration": "先只用5条完整竖线，选两条有10种；4条横线选两条有6种。10乘6，得到60个长方形。",
        "formula": "10×6＝60（个）"
      },
      {
        "title": "先想一想",
        "caption": "短线可使用的横线只有下面3条。",
        "narration": "短竖线没有伸到最上面，能用最顶端那条横线吗？它实际能够连接的横线有几条？",
        "question": {
          "prompt": "短竖线能连接几条横线？",
          "choices": [
            "4条",
            "3条",
            "2条"
          ],
          "answer": 1,
          "explanation": "仅能连接下面三条横线。"
        }
      },
      {
        "title": "加入短线带来的15个",
        "caption": "短线配5条完整线，横边有3种，共15。",
        "narration": "短线另一侧可以选5条完整竖线，下方3条横线选两条有3种。5乘3，新增15个，合计75个。",
        "formula": "60＋5×3＝75（个）"
      },
      {
        "title": "检查短线不越过起点",
        "caption": "60个完整线框，加15个短线框。",
        "narration": "动画逐个框选75个长方形。用到短竖线的框，都只能在下面两层，不能越过短线起点画出不存在的边。",
        "formula": "长方形总数：75个"
      }
    ],
    "exercises": [
      {
        "id": "geometrypartialrectref-1-a",
        "level": "举一反三",
        "prompt": "原图中那条短竖线新增多少个长方形？",
        "answer": "15",
        "unit": "个",
        "hint": "60个完整线框，加15个短线框。",
        "explanation": "短线配5条完整竖线，下面3条横线选2有3种，5×3＝15个。"
      }
    ],
    "takeaway": "60个完整线框，加15个短线框。",
    "mistakes": [
      "只数最小图形，漏掉多个小图形组成的大图形，或重复计数同一个位置。",
      "把原图的缺线补齐，或没有核对题目要求的图形种类与标记条件。"
    ],
    "source": {
      "document": "数学原题分类汇编.docx",
      "question": "第21题",
      "paragraph": 69,
      "kind": "original"
    },
    "images": [
      {
        "src": "/images/reference-20261023/070-40c769982078.png",
        "alt": "原题21·下方新增竖线的长方形原图",
        "caption": "文档原图，可点击放大；动画保留原图线段的连接和缺口。"
      }
    ]
  }
];
