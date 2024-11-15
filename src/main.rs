use core::num;
use js_sys::Number;
use rand::Rng;
use regex::Regex;
use serde::{Deserialize, Serialize};
use std::collections::HashSet;
use std::ffi::OsStr;
use std::fs::OpenOptions;
use std::io::{BufRead, BufReader};
use std::io::{Error, Read, Write};
use std::{env, fs};

#[derive(Serialize, Deserialize, Debug)]
// base json struct
struct FileInfo {
    filename: String,
    kind: String,
    path: String,
    id: String,
    value: String,
    children: Vec<FileInfo>,
}

fn checkFormat(filepath: &String) -> bool {
    let re: Regex = Regex::new(r".(png|jpg|icon|gif|git)").unwrap();
    let Some(caps) = re.captures(filepath) else {
        return false;
    };
    true
}
fn getFileList(innerPath: &str, curDir: String) -> Vec<FileInfo> {
    // println!("reading:\n{}", innerPath);
    // let mut FileList: Vec<FileInfo> = Vec::new();
    let mut ChildrenList: Vec<FileInfo> = Vec::new();
    let cur_path = innerPath;
    let mut cur_dir = curDir;
    // read dir path
    for item in fs::read_dir(cur_path).unwrap() {
        let inner: std::path::PathBuf = item.unwrap().path();
        let entry = &inner;
        let stringPath = entry.display().to_string();
        let innerPath: String = entry.display().to_string();
        let file_name = inner.file_name().and_then(OsStr::to_str).unwrap();
        // let entry = i.unwrap().path()
        let mut contents: String = String::from("");
        let mut curKind: String = String::from("");
        let mut curChildren: Vec<FileInfo> = Vec::new();
        // if is dir do loop
        if entry.is_dir() {
            curKind = String::from("directory");
            contents = String::from("");
            curChildren = getFileList(&stringPath, String::from(file_name));
        } else {
            curKind = String::from("file");
            let isOtherFile = checkFormat(&stringPath);
            // println!("is otherfiles:\n{}", pos);
            // generate context
            if isOtherFile {
                let file = fs::File::open(stringPath).expect("无法打开文件");
                // bufferreader handler image file
                let reader = BufReader::new(file);
                let mut result: String = String::from("");
                for line in reader.lines() {
                    if let Ok(line) = line {
                        result.push_str(&line);
                    }
                }
                // println!("extraFileContext::{}", result);
                contents = result;
                // .expect("Something went wrong reading the file");
            } else {
                contents =
                    fs::read_to_string(stringPath).expect("Something went wrong reading the file");
            }
        }
        let mut innerPath: String = cur_dir.clone();
        innerPath.push_str("/");
        innerPath.push_str(file_name);
        // current path object
        let iteratorInfo: FileInfo = FileInfo {
            filename: String::from(file_name),
            kind: curKind,
            // path: String::from(file_name),
            path: innerPath,
            id: String::from(file_name),
            value: contents,
            children: curChildren,
        };
        ChildrenList.push(iteratorInfo);
    }

    // FileList.push(RootInfo);

    ChildrenList
}

//generateMainKey: 生成目录名称
//entryFilePath: ./导入目录相对路径
//outputFileName: 导出文件名

pub fn generateJsonFile(generateMainKey: &str, entryFilePath: &str, outputFileName: &str) {
    // let outputDir = FileInfo {
    //     filename: String::from(generateMainKey),
    //     kind: String::from("directory"),
    //     path: String::from(generateMainKey),
    //     id: String::from(generateMainKey),
    //     value: String::from(""),
    //     children: getFileList(entryFilePath, String::from(generateMainKey)),
    // };
    // let mut output_vec: Vec<FileInfo> = Vec::new();
    // output_vec.push(outputDir);
    let mut output_vec: Vec<FileInfo> = getFileList(entryFilePath, String::from(generateMainKey));

    //format object to json string
    let serialized = serde_json::to_string(&output_vec).unwrap();
    let mut outPutModule = String::from("");
    outPutModule.push_str("export default{exportFile:");
    outPutModule.push_str(&serialized);
    outPutModule.push_str("}");
    // "module.exports = {" + serialized + "}";
    // generate output json file
    let writeFile = fs::File::create(outputFileName).unwrap();

    let mut file = OpenOptions::new()
        .write(true)
        .open(outputFileName)
        .expect("Could not open file");

    file.write_all(outPutModule.as_bytes());
}
fn main() {
    let mut arg_list = Vec::new();
    for argument in env::args() {
        println!("{argument}");
        arg_list.push(argument)
    }
    let mainKey = &arg_list[1];
    let entryDir: &String = &arg_list[2];
    let outPutFileName: &String = &arg_list[3];
    println!("the whole args{},{},{}", mainKey, entryDir, outPutFileName);
    // generateJsonFile("rust-umi-generate", "./react-umi", "okok.js");
    generateJsonFile(mainKey, entryDir, outPutFileName);
    // let count = 17;
    // let result_cards = getrandomcards(count, card_list);
    // for number in result_cards.iter() {
    //     println!("{}", number);
    // }
}
